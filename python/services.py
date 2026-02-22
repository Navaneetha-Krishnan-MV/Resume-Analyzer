import boto3
import re
from custom import tfidf_similarity,titan_embedding,cosine_similarity_embeddings 
import json
from botocore.exceptions import ClientError
import unicodedata
import fitz  
from pymupdf4llm import to_markdown

# ------------------------
# GLOBAL INITIALIZATION (Lambda optimized)
# ------------------------
s3 = boto3.client("s3")
bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

LOCAL_FILE_PATH = "/tmp/resume.pdf"

DOMAINS = {
    "Machine Learning": [
        "python", "tensorflow", "pytorch", "scikit-learn",
        "pandas", "sql", "deep learning", "nlp",
        "computer vision", "aws sagemaker"
    ],
    "Full Stack": [
        "javascript", "typescript", "react", "Node",
        "express", "mongodb", "postgresql",
        "html", "css", "docker", "aws"
    ],
    "Cloud/DevOps": [
        "aws", "linux", "bash", "docker", "kubernetes",
        "terraform", "jenkins", "ci/cd",
        "ansible", "prometheus"
    ],
    "Cybersecurity": [
        "network security", "linux", "wireshark",
        "penetration testing", "cryptography",
        "firewalls", "owasp", "python",
        "incident response", "ceh"
    ]
}
def normalize(text):
    return text.replace(".", "").replace("-", "").lower()
# ------------------------
# S3
# ------------------------
def copy_resume_from_s3(bucket, key):
    s3.download_file(bucket, key, LOCAL_FILE_PATH)
    return LOCAL_FILE_PATH

# ------------------------
# TEXT EXTRACTION
# ------------------------

def extract_pdf_content(file_path):
    doc = fitz.open(file_path)

    # Layout-aware extraction
    md_text = to_markdown(doc)

    return md_text

# ------------------------
# SKILL EXTRACTION (RULE-BASED)
# ------------------------
def extract_skills(resume_text, role):

    skills = DOMAINS.get(role, [])
    found, not_found = [], []

    norm_resume = normalize(resume_text)

    for skill in skills:
        if normalize(skill) in norm_resume:
            found.append(skill)
        else:
            not_found.append(skill)

    return found, not_found

# ------------------------
# TFIDF 
# ------------------------
def semantic_similarity(resume_text,skills_found , job_desc):

    if not resume_text or not job_desc:
        return 0.0

    #return tfidf_similarity(resume_text, job_desc)
    #resume_skill_text = " ".join(skills_found)
    try:
        emb1 = titan_embedding(resume_text)
        emb2 = titan_embedding(job_desc)

        similarity = cosine_similarity_embeddings(emb1, emb2)
        print(f"Using Embedding")
        return round(similarity, 2)
    except Exception as e:
        print("Embedding failed, fallback to TF-IDF:", str(e))
        return tfidf_similarity(resume_text, job_desc)

# ------------------------
# RAG: RETRIEVER
# ------------------------
def retrieve_context(found_skills, similarity, role, job_desc , resume_text):
    return {
        "role": role,
        #"matched_skills": found_skills,
        "semantic_match": similarity,
        "resume_text":resume_text,  
        "job_description": job_desc[:500]
    }

# ------------------------
# RAG: AI REASONER 
# ------------------------
import json
from botocore.exceptions import ClientError

def generate_ai_suggestions_bedrock(context):

    #Matched skills: {context['matched_skills']}
    prompt = f"""
You are an ATS assistant.

Role: {context['role']}
Resume data: {context['resume_text']} (in markdown format)
Semantic score: {context['semantic_match']} out of 40
Job description: {context['job_description']}

Provide 2–3 resume improvement suggestions.
Ignore formatting suggestions.
Do not invent skills.
Do not use bold text.
Be concise.
"""

    
    body = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {"text": prompt}
                ]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 150,
            "temperature": 0.3
        }
    }

    try:
        print("Invoking Nova Micro...")
        response = bedrock.invoke_model(
            modelId="amazon.nova-micro-v1:0",
            body=json.dumps(body),
            contentType="application/json",
            accept="application/json"
        )

        result = json.loads(response["body"].read())
        text = result["output"]["message"]["content"][0]["text"]

        print("Nova response:", text)
        return text.split("\n")

    except ClientError as e:
        print("Bedrock ClientError:", e.response["Error"]["Message"])
        raise

def generate_ai_suggestions(context):
    try:
        return generate_ai_suggestions_bedrock(context)
    except Exception:
        return [
            "Highlight missing core skills relevant to the role.",
            "Improve alignment between resume content and job description.",
            "Add measurable impact to project descriptions."
        ]

# ------------------------
# SCORING (FOUND + NOT FOUND INCLUDED)
# ------------------------
def calculate_score(found_skills, not_found_skills, similarity):
    found_score = min(found_skills * 10, 60)
    penalty = min(not_found_skills * 3, 20)
    semantic_score = similarity * 40

    final_score = found_score + semantic_score - penalty
    final_score = round(max(0, min(final_score, 100)))

    return {
        "score": final_score,
        "details": {
            "found_score": found_score,
            "penalty": penalty,
            "semantic_score": round(semantic_score, 2)
        }
    }

import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";

const Upload = () => {
    
    const [fileError , setfileError] = useState("");
    const [uploading , setUploading] = useState(false);
    
    const submit = async (event) => {
         event.preventDefault();
         setfileError("");
        
         const formData = new FormData(event.currentTarget);
         const domain = formData.get("domain");
         const jd = formData.get("jd");
         const file = formData.get("resume");

         if (!(file instanceof File) || file.size === 0) {
            setfileError("Please select a PDF resume.");
            return;
         }

         const extension = file.name.split('.').pop()?.toLowerCase();
         console.log("Extension is ", extension);
         if (extension !== "pdf") {
            setfileError("Upload the resume only in pdf format");
            return;
         }

         console.log(domain, " ", jd);

         const apiBase = import.meta.env.VITE_API_GATEWAY_URL;
         if (!apiBase) {
            setfileError("Missing VITE_API_GATEWAY_URL in .env");
            return;
         }

         try {
            setUploading(true);
            // Step 1: Get the Pre-signed URL from Lambda 1
            const presignRes = await fetch(`${apiBase}/getS3Url`).then(res => res.json());
            
            const { uploadUrl, fileKey } = presignRes;
            if (!uploadUrl || !fileKey) {
               throw new Error("getS3Url response missing uploadUrl or fileKey");
            }
            
            // Step 2: Upload the PDF directly to S3
            const uploadRes = await fetch(uploadUrl, {
               method: "PUT",
               body: file,
               headers: {
                  "Content-Type": "application/pdf",
               },
            });
            if (!uploadRes.ok) {
               const text = await uploadRes.text();
               throw new Error(`S3 upload failed (${uploadRes.status}): ${text.slice(0, 200)}`);
            }

            // Step 3: Tell Lambda 2 to analyze the file we just uploaded
            const analyzeRes = await fetch(`${apiBase}/analyze`, {
               method: "POST",
               body: JSON.stringify({ fileKey , domain , jd }),
               headers: { "Content-Type": "application/json" },
            });
            if (!analyzeRes.ok) {
               const text = await analyzeRes.text();
               throw new Error(`analyze failed (${analyzeRes.status}): ${text.slice(0, 200)}`);
            }
            const analyzeType = analyzeRes.headers.get("content-type") || "";
            const analysisResult = analyzeType.includes("application/json")
               ? await analyzeRes.json()
               : await analyzeRes.text();
            setUploading(false);

            useNavigate('/Analyze',{
              state:{
                analyzeRes
              }
            });
            console.log("Analyzed Result ", analysisResult);
         } catch (error) {
            console.error(error);
            setfileError(error?.message || "Something went wrong");
         }
    }

    

    return (
        
        
        <div className="flex flex-col justify-center ">

          {uploading && (
            <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                      <ProgressBar loading={uploading} />
                 <p className="mt-4 text-center font-semibold">Uploading & Analyzing...</p>
              </div>
            </div>
          )}
 
          <h1 className="font-bold  text-[40px] mb-20">Upload To get you know better</h1>
          <form onSubmit={submit}>
           <div className="flex flex-col gap-10">
           <div className="flex flex-row gap-10 justify-center">
           <h3 className="font-semibold ">Select Your interested Domain</h3>

           <select name="domain" id="domain" className="focus:outline-none">
              <option value="Machine Learning">Machine Learning</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Cloud/DevOps">Cloud / Devops</option>
              <option value="Cybersecurity">Cyber Security</option>
           </select>
           </div>


          <h3 className="font-semibold">Paste Your Job Description</h3>
          <div className="flex justify-center">
           <textarea name="jd" id="jd" required
               rows={6}
               className="w-80 border border-black p-2 rounded  "
               placeholder="Paste your job description here..."
            />
         </div>


          <div className="flex flex-row  justify-center">
          <h3 className="font-semibold mr-10">Upload your resume</h3>
          {fileError != "" && (
            <p>{fileError}</p>
          )}

          <input 
            type="file" 
            name="resume"
            accept=".pdf,application/pdf"
            required
            className="block text-sm text-gray-500 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-red-50 file:text-red-700
                       hover:file:bg-red-100"
          />

          </div>

          <div className="flex flex-row justify-center">
             <button type="submit"  className="font-bold border w-30  border-gray-300  py-2 rounded hover:bg-gray-100">Submit</button>
          </div>

          </div>
          </form>
        </div>
    )
}

export default Upload;

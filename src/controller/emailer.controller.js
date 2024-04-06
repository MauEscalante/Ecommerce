import {createTransporter,htmlTemplate} from "../../email/emailer.js"


export const sendEmail=async (req,res)=>{
 
    const {transmitter,receiver,subject,nombre,texto}=req.body;
    const message={
        from:transmitter,
        to:receiver,
        subject:subject,
        text:texto
    }
  
    try {
        await createTransporter.sendMail(message);
        console.log("Email enviado.");
        res.send("Email sent successfully!"); // Send response to client
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error message: "+error); // Inform client about error
      }
    
}
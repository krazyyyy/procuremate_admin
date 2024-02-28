import Button from "../../../../components/fundamentals/button";
import Modal from "../../../../components/molecules/modal";
import InputHeader from "../../../../components/fundamentals/input-header";
import TextArea from "../../../../components/molecules/textarea";
import Medusa from "../../../../services/api";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import useNotification from "../../../../hooks/use-notification";
import { FormImage } from "../../../../types/shared";
import { prepareImages } from "../../../../utils/images";
import FileUploadField from "../../../../components/atoms/file-upload-field";
import { Image } from "@medusajs/medusa";
import CheckCircleFillIcon from "../../../../components/fundamentals/icons/check-circle-fill-icon";
const CreateEmail = ({ handleCancel, email, orderId }) => {
 
  const [isLoadingEmail, setisLoadingEmail] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isGalleryFetch, setIsEmailFetch] = useState(false);
  const [emailCount, setemailCount] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [description, setDescription] = useState("");
  const [append, setAppend] = useState([]);
  
  const notification = useNotification()
    const sendMail = async () => {
        setSubmitting(true)
        let image_url
        if (append?.length) {
            let preppedImages: FormImage[] = []

            try {
            preppedImages = await prepareImages(append)
            } catch (error) {
            let errorMessage =
                "Something went wrong while trying to upload the thumbnail."
            const response = (error as any).response as Response

            if (response.status === 500) {
                errorMessage =
                errorMessage +
                " " +
                "You might not have a file service configured. Please contact your administrator"
            }

            notification("Error", errorMessage, "error")
            return
            }
            const urls = preppedImages.map((image) => image.url)

            image_url = urls[0]
        }
        await Medusa.sendProduction.create({
            description : description,
            image_url : image_url, 
            productin_name:  selectedEmail?.name,
            email : email
        })
        setSubmitting(false)
        notification("success", "Email Sended Succesfully", "success")
    }
  
  const fetchEmails = async (limit, page_number) => {
    try {
      const data = await Medusa.emailTemplate.list(limit, page_number);
      const emailTemplates = data.data.email_templates.email_template;
      setEmailList(emailTemplates);
      setTotalPages(Math.round(data.data.email_templates.totalCount / data.data.email_templates.pageSize));
      setemailCount(data.data.email_templates.totalCount);
      setisLoadingEmail(false);
      setIsEmailFetch(true);
      if (emailTemplates.length > 0) {
        setSelectedEmail(emailTemplates[0]);
        setDescription(emailTemplates[0]?.description || "");
      }
    } catch (error) {
      console.log(error);
      setisLoadingEmail(false);
      setIsEmailFetch(true);
    }
  };
  
  useEffect(() => {
      fetchEmails(100, 1);
    }, []);

    const handleEmailChange = (e) => {
        const selectedEmailName = e.target.value;
        const selectedEmail = emailList.find((email) => email.name === selectedEmailName);
    setSelectedEmail(selectedEmail);
    setDescription(selectedEmail?.description || "");
  };
  const handleFilesChosen = (files: File[]) => {
      if (files.length) {
          const toAppend = files.map((file) => ({
              url: URL.createObjectURL(file),
              name: file.name,
              size: file.size,
              nativeFile: file,
        selected: false,
    }));
    
        setAppend(toAppend)
      return toAppend
    }
  };


  return (
    <Modal handleClose={handleCancel}>
      <Modal.Header handleClose={handleCancel}>
        <span className="inter-xlarge-semibold">Update Status</span>
      </Modal.Header>
      <Modal.Content>
        <div className="grid gap-x-large mb-large">
          <TextArea
            label="Description"
            placeholder="A warm and cozy jacket..."
            rows={3}
            className="mb-small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <InputHeader label="Type" className="mb-2" />
          <select
            className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
            value={selectedEmail?.name || ""}
            onChange={handleEmailChange}
          >
            {emailList.length > 0 ? (
              emailList.map((email) => (
                <option key={email.name} value={email.name}>
                  {email.name}
                </option>
              ))
            ) : (
              <option value="">No email templates available</option>
            )}
          </select>
          <div>
          <div>
          <FileUploadField
            onFileChosen={handleFilesChosen}
            placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
            multiple={false} // Set to false to allow only one image
            filetypes={["image/gif", "image/jpeg", "image/png", "image/webp"]}
            className="py-large"
          />

        </div>
        <div className="flex flex-col gap-y-2xsmall">
            {append.map((field, index) => {
              return (
                <div className="flex items-center gap-x-large">
                <div className="flex items-center justify-center">
                <img src={field?.url}/>
                </div>
                </div>
              
              )
            })}
          </div>
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex flex-end" >
          <Button
            variant="ghost"
            className="mr-2 w-32 text-small justify-center"
            size="large"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            size="large"
            className="w-32 text-small justify-center"
            variant="primary"
            // disabled={!toFulfill?.length || isSubmitting}
            onClick={sendMail}
            loading={isSubmitting}
          >
            Send
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};



export default CreateEmail;

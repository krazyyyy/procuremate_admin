import React, { useState, useEffect } from "react"
import InputField from "../../../../components/molecules/input"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../../components/fundamentals/input-header"
import { Controller } from "react-hook-form"
import TextArea from "../../../../components/molecules/textarea"

export type EmailFormType = {
  name: string
  description: string
  type: string
}

type Props = {
  form: NestedForm<EmailFormType>
}

const EmailForm = ({ form }: Props) => {
    const { register, control, path, setValue } = form

  return (
    <div className="mb-40">
  
      <div className="grid gap-x-large mb-large">
        <InputField
          label="Title"
          placeholder="Title"
          {...register(path("name"))}
        />
      </div>
      <div className="grid gap-x-large mb-large">
      <TextArea
        label="Description"
        placeholder="A warm and cozy jacket..."
        rows={3}
        className="mb-small"
        {...register(path("description"))}

      />
      </div>

      <div className="mb-3">
      <InputHeader label="Type" className="mb-2" />
          <Controller
            name={path("type")}
            control={control}
            render={({ field: { onChange, value } }) => (
              <select className="dropdown-trigger-button w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 h-10"
                onChange={(e) => onChange(e.target.value)}
                value={value}
              >
                <option value="">Select Type</option>
                <option value="Production">Production</option>
                <option value="Other">Other</option>
 
              </select>
            )}
          />
      </div>
    </div>
    
  )
}



export default EmailForm

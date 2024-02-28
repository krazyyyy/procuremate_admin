import React from "react"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../../components/molecules/input"
import TextArea from "../../../../components/molecules/textarea"
import FormValidator from "../../../../utils/form-validator"
export type SeoFormType = {
  seo_title: string | null
  page_title: string | null
  canonical_url: string | null
  seo_description: string | null
}

type Props = {
  form: NestedForm<SeoFormType>
}

const SeoForm = ({ form }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form
  return (
    <div>
    <div className="grid grid-cols-2 gap-x-large mb-small">
      <InputField
        label="SEO Title"
        placeholder="SEO Title"
        {...register(path("seo_title"), {
          minLength: {
            value: 1,
            message: "Title must be at least 1 character",
          },
          pattern: FormValidator.whiteSpaceRule("Title"),
        })}
        errors={errors}
      />
      <InputField
        label="Page Title"
        placeholder="Page Title"
        {...register(path("page_title"), {
          pattern: FormValidator.whiteSpaceRule("Subtitle"),
        })}
        errors={errors}
      />
    </div>

    <div className="grid grid-cols-2 gap-x-large mb-large">
      <InputField
        label="Canonical URL"
        placeholder="Canonical URL"
        {...register(path("canonical_url"), {
          minLength: {
            value: 1,
            message: "Title must be at least 1 character",
        }})}
        errors={errors}
      />
    </div>
    <TextArea
      label="SEO Description"
      placeholder="A warm and cozy jacket..."
      rows={3}
      className="mb-small"
      {...register(path("seo_description"))}
      errors={errors}
    />

  </div>
  )
}

export default SeoForm

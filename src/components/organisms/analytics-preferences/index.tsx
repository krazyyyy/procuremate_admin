import clsx from "clsx"
import React from "react"
import { useForm, useWatch } from "react-hook-form"
import { useAnalytics } from "../../../context/analytics"
import useNotification from "../../../hooks/use-notification"
import {
  analytics,
  useAdminCreateAnalyticsConfig,
} from "../../../services/analytics"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import FocusModal from "../../molecules/modal/focus-modal"
import AnalyticsConfigForm, {
  AnalyticsConfigFormType,
} from "../analytics-config-form"

type AnalyticsPreferenceFormType = {
  email?: string
  config: AnalyticsConfigFormType
}

const AnalyticsPreferencesModal = () => {
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateAnalyticsConfig()

  const form = useForm<AnalyticsPreferenceFormType>({
    defaultValues: {
      config: {
        anonymize: false,
        opt_out: false,
      },
    },
  })
  const {
    register,
    formState: { errors },
    control,
  } = form

  const { setSubmittingConfig } = useAnalytics()

  const watchOptOut = useWatch({
    control: control,
    name: "config.opt_out",
  })

  const watchAnonymize = useWatch({
    control: control,
    name: "config.anonymize",
  })

  const onSubmit = form.handleSubmit((data) => {
    setSubmittingConfig(true)
    const { email, config } = data

    const shouldTrackEmail = !config.anonymize && !config.opt_out

    mutate(config, {
      onSuccess: () => {
        notification(
          "Success",
          "Your preferences were successfully updated",
          "success"
        )

        if (shouldTrackEmail) {
          analytics.track("userEmail", { email })
        }

        setSubmittingConfig(false)
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
        setSubmittingConfig(false)
      },
    })
  })

  return (
    <FocusModal>
      <FocusModal.Main>
        <div className="flex flex-col items-center">

        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default AnalyticsPreferencesModal

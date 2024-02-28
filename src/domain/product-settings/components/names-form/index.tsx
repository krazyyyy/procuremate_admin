import React, { useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import Medusa from "../../../../services/api"
import { useForm } from "react-hook-form"
import { nestedForm } from "../../../../utils/nested-form"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import useNotification from "../../../../hooks/use-notification"
import Spinner from "../../../../components/atoms/spinner"
import NamesSubForm, { NamesFormType } from "./name-sub"
import Accordion from "../../../../components/organisms/accordion"
import NameFinishForm, { NameFinishFormType } from "./name-finish"
import NameCrystalForm, { NameCrystalFormType } from "./name-crystal"
export type NewNamesFormType = {
  names: NamesFormType[]
}

export type NewNameFinishFormType = {
  finish: NameFinishFormType[]
}

export type NewNameCrystalFormType = {
  crystal: NameCrystalFormType
}

const NamesForm = () => {
  const [isLoading, setLoading] = useState(true)
  const notification = useNotification()
  const [allNames, setNames] = useState<NamesFormType[]>([])
  const [allFinishes, setFinishes] = useState<NameFinishFormType[]>([])
  const [allCrystal, setCrystal] = useState<NameCrystalFormType>()

  const form = useForm<NewNamesFormType>()
  const finish_form = useForm<NewNameFinishFormType>()
  const crystal_form = useForm<NewNameCrystalFormType>()

  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(allNames))
      finish_form.reset(createExistingFinishes(allFinishes))
      crystal_form.reset(createExistingCrystal(allCrystal))
    }
  }, [isLoading])

  const getData = async () => {
    const data = await Medusa.customizerNames.list()
    setNames(data.data.names)
    setLoading(false)
  }

  const getFinishesData = async () => {
    const data = await Medusa.customizerNamesFinishes.list()
    setFinishes(data.data.name_finishes)
    // setLoading(false);
  }

  const getCrystalData = async () => {
    const data = await Medusa.customizerNamesCrystal.list()
    setCrystal(data.data.name_crystal[0])
    // setLoading(false);
  }

  useEffect(() => {
    getCrystalData()
    getFinishesData()
    getData()
  }, [])

  const handleAddFinishForm = () => {
    const newNames: NameFinishFormType = {
      id: "",
      title: "",
      price: "",
    }
    setFinishes([...allFinishes, newNames])
  }

  const handleAddForm = () => {
    const newNames: NamesFormType = {
      id: "",
      title: "",
      description: "",
      internal_description: "",
      base_price: "",
      price: "",
      outline_price: "",
      character_limit: "",
      can_have_outline: false,
      can_have_crystals: false,
      can_have_patch: false,
      allow_special_finishes: false,
      optional: false,
      name_outline_material: "",
      patch_price: "",
      patch_material: "",
      crystal_price: "",
      crystal_material: "",
      name_fill_materials: [],
      product_types: [],
    }
    setNames([...allNames, newNames])
  }
  function replaceUndefinedWithEmptyString(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === undefined) {
        obj[key] = ""
      }
    }
    return obj
  }
  const onSubmitFinish = async () => {
    const formData = finish_form.getValues()
    try {
      formData.finish.map(async (name) => {
        if (name.title !== "") {
          const { id, ...rest } = name
          if (id) {
            const resp = await Medusa.customizerNamesFinishes.update(
              id,
              replaceUndefinedWithEmptyString(rest)
            )
          } else {
            const resp = await Medusa.customizerNamesFinishes.create(
              replaceUndefinedWithEmptyString(rest)
            )
          }
        }
      })
      notification("Success", "Successfully Updated", "success")
    } catch (err) {
      notification("Error", "Unknown Error", "error")
    }
  }
  const onSubmitCrystal = async () => {
    const formData = crystal_form.getValues()
    try {
      const { id, ...rest } = formData.crystal
      if (id !== "") {
        const resp = await Medusa.customizerNamesCrystal.update(
          id,
          replaceUndefinedWithEmptyString(rest)
        )
      } else {
        const resp = await Medusa.customizerNamesCrystal.create(
          replaceUndefinedWithEmptyString(rest)
        )
      }
      notification("Success", "Successfully Updated", "success")
    } catch (err) {
      notification("Error", "Unknown Error", "error")
    }
  }

  const onSubmit = async () => {
    const formData = form.getValues()
    try {
      formData.names.map(async (name) => {
        if (name.title !== "") {
          const { id, ...rest } = name
          if (id) {
            const resp = await Medusa.customizerNames.update(
              id,
              replaceUndefinedWithEmptyString(rest)
            )
          } else {
            const resp = await Medusa.customizerNames.create(
              replaceUndefinedWithEmptyString(rest)
            )
          }
        }
      })
      notification("Success", "Successfully Updated", "success")
    } catch (err) {
      notification("Error", "Unknown Error", "error")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <Accordion className="pt-5" type="multiple">
      <div>
        <Accordion.Item title="Names Types" value="Names Types">
          <div className="h-[28px]">
            <PlusIcon
              className="float-right m-1 hover:bg-gray-300"
              onClick={handleAddForm}
            />
          </div>
          <div>
            {allNames.map((_, index) => (
              <NamesSubForm
                key={index}
                setObjectList={setNames}
                index={index}
                form={nestedForm(form, `names`)}
              />
            ))}
          </div>
          <div className="float-right mt-10 flex gap-x-small">
            <Button
              size="small"
              variant="primary"
              type="submit"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </Accordion.Item>
        <Accordion.Item title="Names Finishes" value="Names Finishes">
          <div className="h-[28px]">
            <PlusIcon
              className="float-right m-1 hover:bg-gray-300"
              onClick={handleAddFinishForm}
            />
          </div>
          <div>
            {allFinishes.map((_, index) => (
              <NameFinishForm
                key={index}
                index={index}
                setObjectList={setFinishes}
                form={nestedForm(finish_form, `finish`)}
              />
            ))}
          </div>
          <div className="float-right mt-10 flex gap-x-small">
            <Button
              size="small"
              variant="primary"
              type="submit"
              onClick={onSubmitFinish}
            >
              Update Finishes
            </Button>
          </div>
        </Accordion.Item>
        <Accordion.Item title="Names Crystals" value="Names Crystals">
          <div>
            <NameCrystalForm form={nestedForm(crystal_form, `crystal`)} />
          </div>
          <div className="float-right mt-10 flex gap-x-small">
            <Button
              size="small"
              variant="primary"
              type="submit"
              onClick={onSubmitCrystal}
            >
              Update Crystal
            </Button>
          </div>
        </Accordion.Item>
      </div>
    </Accordion>
  )
}

const createExisting = (allNames: any[]): NewNamesFormType => {
  return {
    names: allNames.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      internal_description: i.internal_description,
      base_price: i.base_price,
      price: i.price,
      outline_price: i.outline_price,
      character_limit: i.character_limit,
      can_have_outline: i.can_have_outline || false,
      can_have_crystals: i.can_have_crystals || false,
      can_have_patch: i.can_have_patch || false,
      allow_special_finishes: i.allow_special_finishes || false,
      optional: i.optional || false,
      name_outline_material: i.name_outline_material,
      patch_price: i.patch_price,
      patch_material: i?.patch_material?.id || "",
      crystal_price: i.crystal_price,
      crystal_material: i?.crystal_material?.id || "",
      name_fill_materials: i.name_fill_materials.map((i) => i.id) || [],
      product_types: i.product_types.map((i) => i.id) || [],
    })),
  }
}

const createExistingFinishes = (allNames: any[]): NewNameFinishFormType => {
  return {
    finish: allNames.map((i) => ({
      id: i.id,
      title: i.title,
      price: i.price,
      is_three_d: i.is_three_d,
    })),
  }
}

const createExistingCrystal = (allNames: any): NewNameCrystalFormType => {
  return {
    crystal: {
      id: allNames?.id || "",
      price: allNames?.price || "",
      description: allNames?.description || "",
      material_type: allNames?.material_type || "",
    },
  }
}
export default NamesForm

import React, { useEffect, useState } from "react";
import Button from "../../../../components/fundamentals/button";
import Medusa from "../../../../services/api";
import ColorSubForm, { ColorFormType } from "./color-sub";
import { useForm } from "react-hook-form";
import { nestedForm } from "../../../../utils/nested-form";
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon";
import useNotification from "../../../../hooks/use-notification";
import Spinner from "../../../../components/atoms/spinner";

export type NewColorFormType = {
  colors: ColorFormType[];
};

const ColorGroupForm = () => {
  const [isLoading, setLoading] = useState(true);
  const notification = useNotification();
  const [allColorGroup, setColorGroup] = useState<ColorFormType[]>([]);

  const form = useForm<NewColorFormType>();

  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(allColorGroup));
    }
  }, [isLoading]);

  const getData = async () => {
    const data = await Medusa.customizerColorGroup.list();
    setColorGroup(data.data.color_groups);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddForm = () => {
    const newArea = { title: "", id: "", material_type: null };
    setColorGroup([...allColorGroup, newArea]);
  };

  const onSubmit = async () => {
    const formData = form.getValues();
    try {
      formData.colors.map(async (color) => {
        if (color.title !== "") {
          const { id, ...rest } = color;
          if (id) {
            const resp = await Medusa.customizerColorGroup.update(id, rest);
          } else {
            const resp = await Medusa.customizerColorGroup.create(rest);
          }
        }
      });
      notification("Success", "Successfully Updated", "success");
    } catch (err) {
      notification("Error", "Unknown Error", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }


  return (
    <div>
      <div className="h-[28px]">
        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
      </div>
      <div>
      {allColorGroup.map((_, index) => (
        <ColorSubForm key={index} setObjectList={setColorGroup} index={index} form={nestedForm(form, `colors`)} />
      ))}
      </div>
      <div className="flex gap-x-small float-right mt-10">
          <Button size="small" variant="primary" type="submit" onClick={onSubmit}>
            Submit
          </Button>
      </div>
    </div>
  );
};

const createExisting = (allColorGroup: any[]): NewColorFormType => {
  return {
    colors: allColorGroup.map((i) => ({
      id: i.id,
      title: i.title,
      material_type: i.materialTypes?.map((c) => c.id) || [],
    })),
  };
};

export default ColorGroupForm;

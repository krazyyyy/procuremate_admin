import React, { useEffect, useState } from "react";
import Button from "../../../../components/fundamentals/button";
import Medusa from "../../../../services/api";
import AreasSubForm, { AreasFormType } from "./area-sub";
import { useForm } from "react-hook-form";
import { nestedForm } from "../../../../utils/nested-form";
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon";
import useNotification from "../../../../hooks/use-notification";
import Spinner from "../../../../components/atoms/spinner";

export type NewAreasFormType = {
  areas: AreasFormType[];
};

const AreasForm = () => {
  const [isLoading, setLoading] = useState(true);
  const notification = useNotification();
  const [allAreas, setAreas] = useState<AreasFormType[]>([]);

  const form = useForm<NewAreasFormType>();

  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(allAreas));
    }
  }, [isLoading]);

  const getData = async () => {
    const data = await Medusa.customizerAreas.list();
    setAreas(data.data.areas);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddForm = () => {
    const newArea = { title: "", id: "", price_adjust: "", optional: false };
    setAreas([...allAreas, newArea]);
  };

  const onSubmit = async () => {
    const formData = form.getValues();
    try {
      formData.areas.map(async (area) => {
        if (area.title !== "") {
          const { id, ...rest } = area;
          if (id) {
            const resp = await Medusa.customizerAreas.update(id, rest);
          } else {
            const resp = await Medusa.customizerAreas.create(rest);
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

  else {
  return (
    <div>
      <div className="h-[28px]">
        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
      </div>
      <div>
      {allAreas.map((_, index) => (
        <AreasSubForm key={index} setObjectList={setAreas} index={index} form={nestedForm(form, `areas`)} />
      ))}
      </div>
      <div className="flex gap-x-small float-right mt-10">
          <Button size="small" variant="primary" type="submit" onClick={onSubmit}>
            Submit
          </Button>
      </div>
    </div>
  );
}
};

const createExisting = (allAreas: any[]): NewAreasFormType => {
  return {
    areas: allAreas.map((i) => ({
      id: i.id,
      title: i.title,
      price_adjust: i.price_adjust,
      optional: i.optional,
    })),
  };
};

export default AreasForm;

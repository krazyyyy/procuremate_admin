import React, { useEffect, useState } from "react";
import InputField from "../../../../components/molecules/input";
import { useForm } from "react-hook-form";
import Button from "../../../../components/fundamentals/button";
import Medusa from "../../../../services/api";
import useNotification from "../../../../hooks/use-notification"
import Spinner from "../../../../components/atoms/spinner";
type GraphicFormType = {
  id: string;
  flag_price: string;
  graphic_price: string;
  upload_price: string;
  muay_thai: string;
  remove_boxer_logo: string;
};

const GraphicForm = () => {
  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    register,
    setValue,
    control,
  } = useForm<GraphicFormType>({
    defaultValues: createBlank(),
  });
  const notification = useNotification()
  const [loading, setLoading] = useState(true);
  const [graphics, setGraphics] = useState<GraphicFormType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Medusa.customizerGraphic.list();

        const graphicsData = data.data.graphics;
        if (graphicsData.length !== 0) {
          setValue("id", graphicsData[0].id);
          setValue("flag_price", graphicsData[0].flag_price);
          setValue("graphic_price", graphicsData[0].graphic_price);
          setValue("upload_price", graphicsData[0].upload_price);
          setValue("muay_thai", graphicsData[0].muay_thai);
          setValue("remove_boxer_logo", graphicsData[0].remove_boxer_logo);
          setGraphics(graphicsData);
        }
      } catch (error) {
        console.error("Failed to fetch graphics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: GraphicFormType) => {

    if (graphics.length !== 0) {
      const {id, ...rest} = graphics[0]
      const response = await Medusa.customizerGraphic.update(id, data);
      notification("Success", "Updated Succesfully", "success")
    } else {
      await Medusa.customizerGraphic.create(data);
      notification("Success", "Created Succesfully", "success")
    }

    // Handle form submission
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }

  return (
    <div className="mb-40">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-x-large mb-large">
          <InputField
            label="Flag Price"
            placeholder="Flag Price"
            {...register("flag_price")}
          />
        </div>
        <div className="grid gap-x-large mb-large">
          <InputField
            label="Graphic Price"
            placeholder="Graphic Price"
            {...register("graphic_price")}
          />
        </div>
        <div className="grid gap-x-large mb-large">
          <InputField
            label="Upload Price"
            placeholder="Upload Price"
            {...register("upload_price")}
          />
        </div>
        <div className="grid gap-x-large mb-large">
          <InputField
            label="Muay Thai"
            placeholder="Muay Thai"
            {...register("muay_thai")}
          />
        </div>
        <div className="grid gap-x-large mb-large">
          <InputField
            label="Remove Boxer Logo"
            placeholder="Remove Boxer Logo"
            {...register("remove_boxer_logo")}
          />
        </div>
        <hr />
        <div className="flex gap-x-small float-right mt-10">
          <Button size="small" variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

const createBlank = (): GraphicFormType => {
  return {
    id: "",
    flag_price: "",
    graphic_price: "",
    upload_price: "",
    muay_thai: "",
    remove_boxer_logo: "",
  };
};

export default GraphicForm;

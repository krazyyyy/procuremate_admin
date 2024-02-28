import React, { useEffect, useState } from "react";
import Button from "../../../../components/fundamentals/button";
import Medusa from "../../../../services/api";
import ProductionTypeForm, { ProductionTypeFormType } from "./production-type";
import { useForm } from "react-hook-form";
import { nestedForm } from "../../../../utils/nested-form";
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon";
import useNotification from "../../../../hooks/use-notification";
import Spinner from "../../../../components/atoms/spinner";
import TextArea from "../../../../components/molecules/textarea";
export type NewProductionForm = {
  id: string
  production_info: string
  production_type: ProductionTypeFormType[];
};

const ProductionForm = () => {
  const [isLoading, setLoading] = useState(true);
  const notification = useNotification();
  const [productionTypes, setProductionType] = useState<ProductionTypeFormType[]>([]);

  const form = useForm<NewProductionForm>();
  const [comment, setComment] = useState('');
  useEffect(() => {
    if (!isLoading) {
      form.reset(createExisting(productionTypes));
    }
  }, [isLoading]);
  const [production, setProduction] = useState([{production_info: String,  id: String}]);
  const getData = async () => {
    const data = await Medusa.productionType.list(100, 1);
    const prod_data = await Medusa.production.list(100, 1);
    setProductionType(data.data.production_type.production_type);
    const prod = prod_data.data.production.production
    setProduction(prod);
    if (prod.length !== 0) {
      form.setValue("id", prod[0].id);
      form.setValue("production_info", prod[0].production_info);
      setComment(prod[0].production_info)
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddForm = () => {
    const newProductionType = { title: "", id: "", description: "",  price : "", days : "", email_title: "", express_shipping: false};
    setProductionType([...productionTypes, newProductionType]);
  };

  const onSubmit = async () => {
    const formData = form.getValues();
    if (production.length !== 0) {
      const {id, ...rest} = production[0]
      const response = await Medusa.production.update(id, {production_info:comment});
    } else {
      await Medusa.production.create({production_info:comment});

    }
    try {
      formData.production_type.map(async (color) => {
        if (color.title !== "") {
          const { id, ...rest } = color;

          if (id) {
            const resp = await Medusa.productionType.update(id, rest);
          } else {
            const resp = await Medusa.productionType.create(rest);
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
        <TextArea
          label="Production Info"
          placeholder="Production Info"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />   
      <div className="h-[28px] mt-4">
        <h1>Production Types</h1>
        <PlusIcon className="float-right hover:bg-gray-300 m-1" onClick={handleAddForm} />
      </div>
      <div>
      {productionTypes.map((_, index) => (
        <ProductionTypeForm key={index} setObjectList={setProductionType} index={index} form={nestedForm(form, `production_type`)} />
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

const createExisting = (productionTypes: any[]): NewProductionForm => {
  return {
    id: "",
    production_info: "",
    production_type: productionTypes.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      price: i.price,
      days: i.days,
      email_title: i.email_title,
      express_shipping: i.express_shipping,
    })),
  };
};

export default ProductionForm;

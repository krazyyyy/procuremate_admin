import { LineItem } from "@medusajs/medusa";
import React, { useEffect, useState } from "react";
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder";
import { formatAmountWithSymbol } from "../../../../utils/prices";
import Medusa from "../../../../services/api";

type OrderLineProps = {
  item: LineItem;
  currencyCode: string;
  jobData: string[] | [];
};

const OrderLine = ({ item, currencyCode, jobData }: OrderLineProps) => {
  const [collectionId, setCollectionId] = useState(null);
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const coll = await Medusa.collections.list({ title: "Ready Made" });

        if (coll.data.collections.length !== 0) {
          setCollectionId(coll.data.collections[0].id);
        }
      } catch (error) {
        // Handle error if collection fetch fails
      } finally {
        setIsLoadingCollection(false);
      }
    };

    fetchCollection();
  }, []);

  const getJobCardUrl = () => {
    if (jobData.length === 1) {
      const jobId = jobData[0];
      return `/a/job-cards/${jobId?.id}`;
    } else if (jobData.length > 1 && item.variant && item.variant.product) {
      const matchingJob = jobData.find((job) =>
        item.variant.product.id.includes(job.product_id?.id)
      );
      if (matchingJob) {
        const jobId = matchingJob.id;
        return `/a/job-cards/${jobId}`;
      }
    }
    return "";
  };

  const jobCardUrl = getJobCardUrl();

  return (
    <div className="flex justify-between mb-1 h-[88px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
      <div className="flex space-x-4 justify-center">
        <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" alt="Thumbnail" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        <div className="flex flex-col justify-center max-w-[185px]">
          <span className="inter-small-regular text-grey-90 truncate">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular text-grey-50 truncate">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
          {collectionId &&
            item?.variant?.product?.collection_id && (
              <>
                {jobCardUrl && (
                  <a
                    href={jobCardUrl}
                    className="inter-small-regular mt-5 text-grey-90 bg-black text-white text-center"
                  >
                    Job Card
                  </a>
                )}
              </>
            )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex small:space-x-2 medium:space-x-4 large:space-x-6 mr-3">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: (item?.total ?? 0) / item.quantity,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
          <div className="inter-small-regular text-grey-50">
            x {item.quantity}
          </div>
          <div className="inter-small-regular text-grey-90">
            {formatAmountWithSymbol({
              amount: item.total ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default OrderLine;

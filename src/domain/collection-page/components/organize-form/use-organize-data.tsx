import { useAdminCollections, useAdminProductTypes, useAdminProductCategories } from "medusa-react"
import { useMemo } from "react"
import { NestedMultiselectOption } from "../../../categories/components/multiselect"
import { transformCategoryToNestedFormOptions } from "../../../categories/utils/transform-response"

const useOrganizeData = (type) => {
  const { product_types } = useAdminProductTypes(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
  const { collections } = useAdminCollections()
  const { product_categories: categories = [] } = useAdminProductCategories(
    {
      parent_category_id: "null",
      include_descendants_tree: true,
    }
  )
  const productTypeOptions = useMemo(() => {
    return (
      product_types?.map(({ id, value }) => ({
        value: id,
        label: value,
      })) || []
    )
  }, [product_types])

  const collectionOptions = useMemo(() => {
    if (type === "Ready Made") {
      const filteredCollections = collections?.filter(({ title }) => title === type);
      return (
        filteredCollections?.map(({ id, title }) => ({
          value: id,
          label: title,
        })) || []
      );
    } else if ( type === "Custom") {
      const filteredCollections = collections?.filter(({ title }) => title !== "Ready Made");
      return (
        filteredCollections?.map(({ id, title }) => ({
          value: id,
          label: title,
        })) || []
      );

    } else {
      return (
        collections?.map(({ id, title }) => ({
          value: id,
          label: title,
        })) || []
      );
    }
  }, [collections]);

  const categoriesOptions: NestedMultiselectOption[] | undefined = useMemo(
    () => categories?.map(transformCategoryToNestedFormOptions),
    [categories]
  )

  return {
    productTypeOptions,
    collectionOptions,
    categoriesOptions
  }
}

export default useOrganizeData

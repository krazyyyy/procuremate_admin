import { useAdminCollections, useAdminProductTypes } from "medusa-react"
import { useMemo } from "react"

const useOrganizeData = () => {
  const { product_types } = useAdminProductTypes(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
  const { collections } = useAdminCollections()

  const productTypeOptions = useMemo(() => {
    return (
      product_types?.map(({ id, value }) => ({
        value: id,
        label: value,
      })) || []
    )
  }, [product_types])

  const collectionOptions = useMemo(() => {
    const filteredCollections = collections?.filter(({ title }) => title !== "Ready Made");
    return (
      filteredCollections?.map(({ id, title }) => ({
        value: id,
        label: title,
      })) || []
    );
  }, [collections]);
  return {
    productTypeOptions,
    collectionOptions,
  }
}

export default useOrganizeData

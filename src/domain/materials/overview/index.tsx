import { useAdminCreateBatchJob, useAdminCreateCollection } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Fade from "../../../components/atoms/fade-wrapper"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { PollingContext } from "../../../context/polling"
import CustomTable from "../../../components/templates/custom-table"
import NewColorGroup from "../new/new-color"
import Medusa from "../../../services/api"
import NewMaterials from "../new/new-material"
import NewMaterialType from "../new/new-material-type"

const VIEWS = ["Materials", "Color-Group", "Materials-Type"]

const Overview = () => {

  const location = useLocation()
  const [view, setView] = useState("Materials")
  const {
    state: createMaterialState,
    close: closeMaterialCreate,
    open: openMaterialCreate,
  } = useToggleState()
 
  const {
    state: createColorGroupState,
    close: closeColorGroupCreate,
    open: openColorGroupCreate,
  } = useToggleState()
 
  const {
    state: createMaterialTypeState,
    close: closeMaterialTypeCreate,
    open: openMaterialTypeCreate,
  } = useToggleState()


  const [offs, setOffs] = useState(0)
  useEffect(() => {
    if (location.search.includes("?view=color-group")) {
      setView("Color-Group")
    }
    if (location.search.includes("?view=materials-type")) {
      setView("Materials-Type")
    }
    location.search = ""
    setOffs(0)
    setisMaterialFetch(false)
    setisMaterialFetchType(false)
    setisColorFetch(false)
  }, [view, location])


  const [isLoadingCustomColor, setisLoadingCustomColor] = useState(true);
  const [colorsList, setColor] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isColorFetch, setisColorFetch] = useState(false);
  const [count, setCount] = useState(1)
  
  
  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_PAGE_SIZE = 15;
  // const offs = parseInt(searchParams.get('offset')) || 0;
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
  let pageNumber = Math.floor(offs / limit) + 1;
  
  const handlePrev = () => {
    setOffs((prevOffs) => Math.max(0, prevOffs - limit));
  };

  const handleNext = () => {
    setOffs((prevOffs) => prevOffs + limit);
  };
  const [shouldUpdateQuery, setShouldUpdateQuery] = useState(true);

  const fetchColors = async (limit, page_number, search="") => {
    try {
      let data;
      if (search !== "") {
        if (search.includes("=")) {
        data = await Medusa.customColorGroup.list(
          limit,
          page_number,
          `${search}`
        );
      } else {
        data = await Medusa.customColorGroup.list(
          limit,
          page_number,
          `title=${search}`
        );
        }
    } else {
        data = await Medusa.customColorGroup.list(
          limit,
          page_number
        );
      
      }
     
      const li = data.data.custom_color_group.custom_color_group.map(
        (item) => item
      );
      setColor(li);
      const total = Math.ceil(
        data.data.custom_color_group.totalCount /
          data.data.custom_color_group.pageSize
      );
      setTotalPages(total);
      setCount(data.data.custom_color_group.totalCount)
      setisLoadingCustomColor(false);
      setisColorFetch(true)
    } catch (error) {
      console.log(error)
      setisLoadingCustomColor(false);
      setisColorFetch(true)
    }
  };


  const [isLoadingMaterial, setisLoadingMaterial] = useState(true);
  const [materialList, setMaterial] = useState([]);
  const [totalMaterialPages, setTotalMaterialPages] = useState(0);
  const [isMaterialFetch, setisMaterialFetch] = useState(false);
  const [countMaterial, setMaterialCount] = useState(1)
 

  const fetchMaterial = async (limit, page_number, search="") => {
    try {
      let data;
      if (search !== "") {
      if (search.includes("=")) {
      
      const foundObject = materialListTypeFilter.find(obj => obj.title === search.split("=")[1]);

      data = await Medusa.customMaterial.list(
        limit,
        page_number,
        `material_type=${foundObject?.id}`
      );
    } else {
      data = await Medusa.customMaterial.list(
        limit,
        page_number,
        `title=${search}`
      );

    }
    } else {
      data = await Medusa.customMaterial.list(
        limit,
        page_number
      );
      }
      const materials = await Medusa.materialType.list(
        100,
        1
      )
      const materials_type_li = materials.data.material_types.material_types.map(
        (item) => item
      );
      setMaterialTypeFilter(materials_type_li)
      const li = data.data.custom_material.custom_material.map(
        (item) => item
      );
      setMaterial(li);
      const total = Math.ceil(
        data.data.custom_material.totalCount /
          data.data.custom_material.pageSize
      );
      setTotalMaterialPages(total);
      setMaterialCount(data.data.custom_material.totalCount)
      setisLoadingMaterial(false);
      setisMaterialFetch(true)
    } catch (error) {
      console.log(error)
      setisLoadingMaterial(false);
      setisMaterialFetch(true)
    }
  };

  const [isLoadingMaterialType, setisLoadingMaterialType] = useState(true);
  const [materialListType, setMaterialType] = useState([]);
  const [materialListTypeFilter, setMaterialTypeFilter] = useState([]);
  const [totalMaterialPagesType, setTotalMaterialPagesType] = useState(0);
  const [isMaterialFetchType, setisMaterialFetchType] = useState(false);
  const [countMaterialType, setMaterialCountType] = useState(1)


  const fetchMaterialType = async (limit, page_number, search="") => {
    try {
      let data;
      if (search !== "") {
        if (search.includes("=")) {
        data = await Medusa.materialType.list(
          limit,
          page_number,
          `${search}`
        );
      } else {
          data = await Medusa.materialType.list(
            limit,
            page_number,
            `title=${search}`
          );

        }
      } else {
        data = await Medusa.materialType.list(
          limit,
          page_number
        );
      }
      const li = data.data.material_types.material_types.map(
        (item) => item
      );
      setMaterialType(li);
      const total = Math.ceil(
        data.data.material_types.totalCount /
          data.data.material_types.pageSize
      );
      setTotalMaterialPagesType(total);
      setMaterialCountType(data.data.material_types.totalCount)
      setisLoadingMaterialType(false);
      setisMaterialFetchType(true)
    } catch (error) {
      console.log(error)
      setisLoadingMaterialType(false);
      setisMaterialFetchType(true)
    }
  };


  const [query, setQuery] = useState("");
  useEffect(() => {
    if (view === "Color-Group") {
      fetchColors(limit, pageNumber, query);
    }
    if (view === "Materials") {
      
      setQuery(query.replace("material_type", ""))
      fetchMaterial(limit, pageNumber, query);
    }
    if (view === "Materials-Type") {

      fetchMaterialType(limit, pageNumber, query);
    }
  }, [query, offs]);
  const CurrentView = () => {
      useEffect(() => {
        if (view === "Color-Group" && !isColorFetch) {

          fetchColors(limit, pageNumber, query);
          setQuery('')
        }
        if (view === "Materials" && !isMaterialFetch) {
          
          fetchMaterial(limit, pageNumber, query);
          setQuery('')
        }
        if (view === "Materials-Type" && !isMaterialFetchType) {
          
          fetchMaterialType(limit, pageNumber, query);
          setQuery('')
          
        }
      }, [view]);

      
    switch (view) {
      case "Color-Group":
        return (
          <CustomTable 
            isLoading={isLoadingCustomColor}
            itemList={colorsList}
            totalPages={totalPages}
            offs={offs}
            limit={limit}
            handlePrev={handlePrev}
            handleNext={handleNext}
            count={count}
            query={query}
            setQuery={setQuery}
            deleteData={Medusa.customColorGroup.delete}
            path_name={`/a/materials/color/`}
            setItemList={setColor}
            header={[
              { Header: "", accessor: "hex_color" },
              { Header: "Title", accessor: "title" },
            ]}
          />
        )
      case "Materials-Type":
        return (
          <CustomTable 
            isLoading={isLoadingMaterialType}
            itemList={materialListType}
            totalPages={totalMaterialPagesType}
            offs={offs}
            limit={limit}
            handlePrev={handlePrev}
            handleNext={handleNext}
            count={countMaterialType}
            deleteData={Medusa.materialType.delete}
            path_name={`/a/materials/type/`}
            setItemList={setMaterialType}
            query={query}
            setQuery={setQuery}
            header={[
              { Header: "Title", accessor: "title" },
            ]}
            />
            )
            case "Materials":
              return (
            <CustomTable 
            isLoading={isLoadingMaterial}
            itemList={materialList}
            query={query}
            setQuery={setQuery}
            totalPages={totalMaterialPages}
            offs={offs}
            limit={limit}
            handlePrev={handlePrev}
            handleNext={handleNext}
            filterTitle="Material Type"
            filterList={materialListTypeFilter.map((i) => i?.title)}
            count={countMaterial}
            deleteData={Medusa.customMaterial.delete}
            path_name={`/a/materials/material/`}
            setItemList={setMaterial}
            header={[
              { Header: "", accessor: "image_url" },
              { Header: "Title", accessor: "title" },
              { Header: "Thai Name", accessor: "thai_name" },
              { Header: "Groups", accessor: "customColor" },
              { Header: "Price", accessor: "price" },
            ]}
          />
        )
      default:
        return <></>;
    }
  };
  

  const CurrentAction = () => {
    switch (view) {
      case "Materials": 
        return (
            <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openMaterialCreate}
            >
              <PlusIcon size={20} />
              New Material
            </Button>
          </div>
        )
      case "Color-Group": 
        return (
            <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openColorGroupCreate}
            >
              <PlusIcon size={20} />
              New Color Group
            </Button>
          </div>
        )
      case "Materials-Type": 
        return (
            <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={openMaterialTypeCreate}
            >
              <PlusIcon size={20} />
              New Material Type
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
            >
              <PlusIcon size={20} />
              New Item
            </Button>
          </div>
        )
    }
  }


  



  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            forceDropdown={false}
            customActionable={CurrentAction()}
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={setView}
                activeView={view}
              />
            }
            className="h-fit"
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>

      <Fade isVisible={createMaterialState} isFullScreen={true}>
        <NewMaterials onClose={closeMaterialCreate} />
      </Fade>
      <Fade isVisible={createColorGroupState} isFullScreen={true}>
        <NewColorGroup onClose={closeColorGroupCreate} />
      </Fade>
      <Fade isVisible={createMaterialTypeState} isFullScreen={true}>
        <NewMaterialType onClose={closeMaterialTypeCreate} />
      </Fade>

    </>
  )
}

export default Overview

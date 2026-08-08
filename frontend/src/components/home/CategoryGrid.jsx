import { useEffect } from "react";

import { useDispatch,useSelector } from "react-redux";

import { getCategories } from "../../services/category.service";

import { setCategories, setLoading, setError } from "../../features/category/categorySlice";

const CategoryGrid = () => {
    const dispatch = useDispatch();

    const { categories } =

    useSelector(

    state=>state.category

    );
    useEffect(()=>{

        const loadCategories = async()=>{
    
            try{
    
                dispatch(
    
                    setLoading(true)
    
                );
    
                const response=
    
                    await getCategories();
    
                dispatch(
    
                    setCategories(
    
                        response.data.data
    
                    )
    
                );
    
            }
    
            catch(error){
    
                dispatch(
    
                    setError(
    
                        error.message
    
                    )
    
                );
    
            }
    
            finally{
    
                dispatch(
    
                    setLoading(false)
    
                );
    
            }
    
        };
    
        loadCategories();
    
    },[]);

    return (

        <section className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-10">

        {
            categories.map(category=>(

            <div

            key={category._id}

            className="bg-white shadow rounded-lg p-6"

            >

            <h3>

            {category.name}

            </h3>

            </div>

            ))
        }
        </section>

    );

};

export default CategoryGrid;
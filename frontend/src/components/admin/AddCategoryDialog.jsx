import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

import {
    createCategory
} from "@/services/category.service";

const schema = z.object({

    name: z.string().min(2),

    description: z.string().optional(),

    sortOrder: z.coerce.number()

});

const AddCategoryDialog = ({

    onSuccess

}) => {

    const {

        register,

        handleSubmit,

        reset

    } = useForm({

        resolver: zodResolver(schema),

        defaultValues:{

            sortOrder:0

        }

    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {

        try {
    
            setLoading(true);
    
            await createCategory(data);
    
            toast.success("Category created");
    
            reset();
    
            onSuccess();
    
        } catch (error) {
    
            toast.error(
    
                error.response?.data?.message ||
    
                "Error"
    
            );
    
        } finally {
    
            setLoading(false);
    
        }
    
    };

    return(

        <Dialog>

            <DialogTrigger asChild>

                <Button>

                    Add Category

                </Button>

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Add Category

                    </DialogTitle>

                </DialogHeader>

                <form

                    onSubmit={handleSubmit(onSubmit)}

                    className="space-y-4"

                >

                    <Input

                        placeholder="Category Name"

                        {...register("name")}

                    />

                    <Textarea

                        placeholder="Description"

                        {...register("description")}

                    />

                    <Input

                        type="number"

                        {...register("sortOrder")}

                    />

                <Button

                className="w-full"

                disabled={loading}

                >

                {

                    loading

                        ? "Creating..."

                        : "Create Category"

                }

                </Button>

                </form>

            </DialogContent>

        </Dialog>

    );

};

export default AddCategoryDialog;
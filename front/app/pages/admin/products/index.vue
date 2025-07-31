<template>
    <div class="bg-stone-100 w-full mr-2 my-2 rounded-md p-2">
        <h1>Product</h1>
        <div>
            <form @submit.prevent="submit">
                <div>
                    <label for="productName">Product Name</label>
                    <input v-model="productName" type="text" name="productName">
                </div>

                <div>
                    <label for="Category">Category</label>
                    <input v-model="category" type="text" name="Category">
                </div>

                <div>
                    <label for="unitOfMeasurement">Unit Of Measurement</label>
                    <input v-model="unitOfMeasure" type="text" name="unitOfMeasurement">
                </div>

                <div>
                    <label for="minimumStockLevel">Minimum Stock Level</label>
                    <input v-model="minStockLevel" type="number" name="minimumStockLevel">
                </div>

                <div>
                    <label for="maximumStockLevel">Maximum Stock Level</label>
                    <input v-model="maxStockLevel" type="number" name="maximumStockLevel">
                </div>

                <div>
                    <label for="Imagepath">Select Image </label>
                    <input @change="fileChange" accept="image/*" type="file" name="image">
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    const productName = ref("");
    const category = ref("");
    const unitOfMeasure = ref("");
    const minStockLevel = ref(0);
    const maxStockLevel = ref(0);
    const image = ref(null);

    function fileChange(e){
        image.value = e.target.files[0]
        console.log(image.value);
    }

    const submit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", productName.value);
            formData.append("category", category.value);
            formData.append("unit_of_measurement", unitOfMeasure.value);
            formData.append("min_stock_level", minStockLevel.value);
            formData.append("max_stock_level", maxStockLevel.value);
            formData.append("image", image.value); 

            const response = await fetch("http://localhost:5000/api/item/add", {
            method: "POST",
            body: formData,
            credentials: "include",
            });

            const result = await response.json();
            console.log(" Server Response:", result);
        } catch (e) {
            console.error(" Submit error:", e);
        }
        };

    
    function reset(){
        productName.value = ""
        category.value = ""
        unitOfMeasure.value = ""
        minStockLevel.value = 0 
        maxStockLevel.value = 0
        image.value = null
    }

    definePageMeta({
        layout: 'admin',
    })
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <div v-for="p in products" v-bind:key="p.id" class="card m-1 p-1 bg-light">
            <h4>
                {{p.name}}
                <span class="badge badge-pill badge-primary float-right">
                    {{p.price | currency}}
                </span>
            </h4>
            <div class="card-text bg-white p-1">
                {{ p.description }}
                <button class="btn btn-success btn-sm float-right" v-on:click="handleProductAdd(p)">
                    Add To Cart
                </button>
            </div>
        </div>
        <page-controls />
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import PageControls from "./PageControls";
//There are different vuex functions for different types of operations. 
//mapState is used to create a mapping between the component and state data in the data store.
//In the below code, mapState is used with the spread operator because it can map multiple data store properties in a single operation.
export default {
    components: { PageControls },
    computed: {
        ...mapGetters({ products: "processedProducts"})
    },
    filters: {
        currency(value) {
            return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD" }).format(value);
        }
    },
    methods: {
        ...mapMutations({ addProduct: "cart/addProduct" }),
        handleProductAdd(product) {
            this.addProduct(product);
            //After the addProduct mutation has been invoked, the handleProductAdd method uses the routing system
            //to navigate to the /cart URL with the following statement
            this.$router.push("/cart");
        }
    }
}
</script>
import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import CartModule from "./cart";
/*
It is important to note that plugins must be enabled using 'Vue.use' method.
If you forget to call the 'use' method, 
then the data store features won't be available in the rest of the application.
*/
Vue.use(Vuex);

const baseUrl = "http://localhost:3500";
const productsUrl = `${baseUrl}/products`;
const categoriesUrl = `${baseUrl}/categories`;
/*
A data store is created using the 'new' keyword to create a Vuex.Store object,
passing a configuration object. The purpose of the 'state' property is used to define
the data values contained in the store. To get t he data store started,
I have used a 'for' loop to generate an array of test data that I have assigned
to a state property named 'products'.
The purpose of the 'strict' property is less obvious and relates to the unusual way that Vuex works.
Data values are read-only and are modified only through mutations, which are just Javascript Methods
that change the data.
This 'strict' mode is a useful feature that generates a warning if you forget to use a mutation
and modify data values directly -- something that happens often as you become used to the way that Vuex works.
*/
export default new Vuex.Store({
    strict: true,
    modules: { cart: CartModule },
    state: {
        products: [],
        categoriesData: [],
        productsTotal: 0,
        currentPage: 1,
        pageSize: 4,
        currentCategory: "All"
    },
    getters: {
        productsFilteredByCategory: state => state.products.filter(p => state.currentCategory == "All"
        || p.category == state.currentCategory),
        processedProducts: (state, getters) => {
            let index = (state.currentPage - 1) * state.pageSize;
            return getters.productsFilteredByCategory.slice(index, index + state.pageSize);
        },
        pageCount: (state, getters) => Math.ceil(getters.productsFilteredByCategory.length / state.pageSize),
        categories: state => ["All", ...state.categoriesData]
    },
    mutations: {
        setCurrentPage(state, page) {
            state.currentPage = page;
        },
        setPageSize(state, size) {
            state.pageSize = size;
            state.currentPage = 1;
        },
        setCurrentCategory(state, category) {
            state.currentCategory = category;
            state.currentPage = 1;
        },
        setData(state, data) {
            state.products = data.pdata;
            state.productsTotal = data.pdata.length;
            state.categoriesData = data.cdata.sort();
        }
    },
    actions: {
        async getData(context) {
            let pdata = (await Axios.get(productsUrl)).data;
            let cdata = (await Axios.get(categoriesUrl)).data;
            context.commit("setData", { pdata, cdata });
        }
    }
})
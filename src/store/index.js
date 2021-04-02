import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import CartModule from "./cart";
import OrdersModule from "./orders";
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
    modules: { cart: CartModule, orders: OrdersModule },
    state: {
        //products: [],
        categoriesData: [],
        //productsTotal: 0,
        currentPage: 1,
        pageSize: 4,
        currentCategory: "All",
        pages: [],
        serverPageCount: 0,
        searchTerm: "",
        showSearch: false
    },
    getters: {
        //productsFilteredByCategory: state => state.products.filter(p => state.currentCategory == "All"
        //|| p.category == state.currentCategory),
        processedProducts: (state) => {
            return state.pages[state.currentPage];
        },
        pageCount: (state) => state.serverPageCount,
        categories: state => ["All", ...state.categoriesData]
    },
    mutations: {
        _setCurrentPage(state, page) {
            state.currentPage = page;
        },
        _setPageSize(state, size) {
            state.pageSize = size;
            state.currentPage = 1;
        },
        _setCurrentCategory(state, category) {
            state.currentCategory = category;
            state.currentPage = 1;
        },
        //setData(state, data) {
        //    state.products = data.pdata;
        //    state.productsTotal = data.pdata.length;
        //    state.categoriesData = data.cdata.sort();
        //}
        addPage(state, page) {
            for (let i = 0; i < page.pageCount; i++) {
                Vue.set(state.pages, page.number + i,page.data.slice(i * state.pageSize, (i * state.pageSize) + state.pageSize));
            }
        },
        clearPages(state) {
            state.pages.splice(0, state.pages.length);
        },
        setCategories(state, categories) {
            state.categoriesData = categories;
        },
        setPageCount(state, count) {
            state.serverPageCount = Math.ceil(Number(count) / state.pageSize);
        },
        setShowSearch(state, show) {
            state.showSearch = show;
        },
        setSearchTerm(state, term) {
            state.searchTerm = term;
            state.currentPage = 1;
        },
    },
    actions: {
        async getData(context) {
          await context.dispatch("getPage", 2);
          context.commit("setCategories", (await Axios.get(categoriesUrl)).data);
        },
        async getPage(context, getPageCount = 1) {
            let url = `${productsUrl}?_page=${context.state.currentPage}` + `&_limit=${context.state.pageSize * getPageCount}`;
            if (context.state.currentCategory != "All") {
                url += `&category=${context.state.currentCategory}`;
            }
            if (context.state.searchTerm != "") {
                url += `&q=${context.state.searchTerm}`;
            }
            let response = await Axios.get(url);
            context.commit("setPageCount", response.headers["x-total-count"]);
            context.commit("addPage", { number: context.state.currentPage, data: response.data, pageCount: getPageCount});
        },
        setCurrentPage(context, page) {
            context.commit("_setCurrentPage", page);
            if (!context.state.pages[page]) {
                context.dispatch("getPage");
            }
        },
        setPageSize(context, size) {
            context.commit("clearPages");
            context.commit("_setPageSize", size);
            context.dispatch("getPage", 2);
        },
        setCurrentCategory(context, category) {
            context.commit("clearPages");
            context.commit("_setCurrentCategory", category);
            context.dispatch("getPage", 2);
        },
        search(context, term) {
            context.commit("setSearchTerm", term);
            context.commit("clearPages");
            context.dispatch("getPage", 2);
        },
        clearSearchTerm(context) {
            context.commit("setSearchTerm", "");
            context.commit("clearPages");
            context.dispatch("getPage", 2);
        }
    }
})
<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x ref="book-table" storeName="book-table" :parentId="null" v-bind="bookDefs" @form-open="openBookForm">
          <template v-slot:filter="{ filterData, parentId, storeName, vcx }">
            <h1>Custom {{ storeName }} Filter Slot</h1>
            <p>Records: {{ vcx.records.length }}</p>
            <div v-for="(filter, index) in filterData" :key="index">
              <component :is="filter.type" v-model="filter.value" v-bind="filter.attrs"></component>
            </div>
          </template>
          <template v-slot:form="{ record, parentId, storeName }">
            <div>
              <h1>Custom {{ storeName }} Form Slot - Has Parent: {{ !!parentId }}</h1>
              <v-card-text>
                <v-text-field label="Name" v-model="record.name"></v-text-field>
                v-select will not scale, use v-autocomplete & rx-js with lazy fetching instead
                <v-select
                  ref="categories"
                  label="Category"
                  v-model="record.categoryId"
                  :items="categories"
                  required
                  item-text="name"
                  item-value="id"
                />
                <v-select
                  ref="authors"
                  label="Search for a author... (Maximum 2)"
                  v-model="authorIds"
                  :items="authors"
                  item-text="name"
                  item-value="id"
                  multiple
                  chips
                  clearable
                  hide-selected
                />
                <v-btn @click.stop.prevent="gotoPages(record.id)" dark>View Book Pages</v-btn>
              </v-card-text>
            </div>
          </template>
        </vue-crud-x>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import VueCrudX from '@/components/VueCrudX'

export default {
  name: 'books',
  middleware: ['auth'],
  components: {
    VueCrudX
  },
  data() {
    return {
      ready: false,
      // auto-complete
      isLoading: false,
      authorIds: [], // use record
      authors: [],
      categories: [],
      bookDefs: {
        crudTable: {
          actionColumn: false,
          addrowCreate: false,
          // inline: false,
          confirmCreate: true,
          confirmUpdate: true,
          confirmDelete: true,
          headers: [{ text: 'Book Name', value: 'name', class: 'pa-1' }, { text: 'Category', value: 'categoryName', class: 'pa-1' }],
          formatters: (value, _type) => value,
          doPage: 2,
          showFilterButton: false
        },

        crudFilter: {
          FilterVue: null,
          filterData: {
            name: {
              type: 'v-text-field',
              value: '',
              attrs: {
                label: 'Book Name',
                clearable: true
              }
            },
            categoryName: {
              type: 'v-select',
              value: { text: 'All', value: 0 },
              attrs: {
                label: 'Category',
                multiple: false,
                'return-object': true,
                items: [{ text: 'All', value: 0 }, { text: 'cat1', value: 1 }, { text: 'cat2', value: 2 }],
                rules: [v => !!v || 'Item is required']
              }
            }
          }
        },

        crudForm: {
          FormVue: () => {},
          formAutoData: null,
          defaultRec: () => ({
            id: '',
            name: '',
            categoryId: '',
            categoryName: '',
            authorIds: [],
            authors: []
          })
        },

        // CRUD
        crudOps: {
          export: async payload => {},
          find: async payload => {
            let records = []
            let totalRecords = 0
            const { pagination, filterData } = payload
            console.log('find222', filterData)
            try {
              const { page, rowsPerPage } = pagination // sortBy, descending
              let params = { page: page > 0 ? page - 1 : 0, limit: rowsPerPage } // set query params
              if (filterData.name.value) params.name = filterData.name.value
              if (filterData.categoryName.value.value) params['category-id'] = filterData.categoryName.value.value
              try {
                const {
                  data: { results, total }
                } = await this.$axios.get('/api/books', { params })
                records = results
                totalRecords = total
              } catch (e) {
                console.log(e)
              }
            } catch (e) {
              console.log('foobar', e, pagination)
            }
            return { records, pagination, totalRecords }
          },
          findOne: async payload => {
            const { id } = payload
            try {
              const { data } = await this.$axios.get(`/api/books/${id}`)
              return data
            } catch (e) {}
            return {}
          },
          create: async payload => {
            try {
              let {
                record: { id, ...noIdData }
              } = payload
              const rv = await this.$axios.post('/api/authors', noIdData)
              console.log(rv)
            } catch (e) {
              return 500
            }
            // return { ok: true, msg: 'OK' }
            return 201
          },
          // TBD Set the linkages also
          update: async payload => {
            // console.log('update payload', payload)
            try {
              let {
                record: { id, name, categoryId, authorIds }
              } = payload // authorIds
              // check that you only save what is needed...
              // console.log('record', id, noIdData)
              const rv = await this.$axios.patch(`/api/books/${id}`, {
                name,
                categoryId,
                authorIds
              }) // TBD also update the author ids...?
              console.log('patch rv', rv)
              // if (!doc.exists) throw new Error(409)
            } catch (e) {
              if (parseInt(e.message) === 409) return 409
              else return 500
            }
            return 200
          },
          delete: null // TBD if delete, must also delete all dependancies, move all buttons to right?
        }
      }
    }
  },
  watch: {
    authorIds(val) {
      if (val.length > 2) val.pop()
      if (this.$refs['book-table']) this.$refs['book-table'].record.authorIds = val
    }
  },
  async mounted() {
    let rv
    try {
      rv = await this.$axios.get('/api/categories') // assume this fetches all data
      this.categories = rv.data.results
      // console.log('aaa 33', this.authors, this.categories, this.$refs.authors.items, this.$refs.categories.items)
    } catch (e) {}
    this.ready = true
  },
  methods: {
    gotoPages(id) {
      // go to pages table for selected book
      // console.log('gotoPages - BookId: ', id)
      this.$router.push({ path: `/books/${id}/pages` })
    },
    async openBookForm(item) {
      // console.log('openBookForm', item)
      this.authorIds = item.authorIds
      let rv = await this.$axios.get('/api/authors', { params: { page: 0, limit: 20 } }) // assume this fetches all data
      this.authors = rv.data.results
      // this.authors = item.authors
    }
  }
}
</script>

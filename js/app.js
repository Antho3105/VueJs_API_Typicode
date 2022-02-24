let vm = new Vue({

    el: '#app',
    data: {
        data: [],
    },
    created: function () {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => this.data = json)

    },
    computed: {

    },
    filters: {

    },
    methods: {


    },
});


let information = {
    template: `
    <section>
        <div>
            <h1>Liste utilisateurs</h1>
            <p> Il y a {{this.data.length}} utilisateurs dans l'application</p>

            <select v-model="selectedUser" name="" id="">
                <option value="-1" selected>Selectionnez un utilisateur</option>
                <option v-for="(user, index) of data" :value="index">{{user.name}}</option>
            </select>
        </div>
        <div id="userinfo">
            <div v-if="selectedUser != -1">
                <h2>{{data[selectedUser].name}} ({{data[selectedUser].username}})</h2>
                <p>id n°{{data[selectedUser].id}}</p>
                <ul>
                    <li>email : {{data[selectedUser].email}}</li>
                    <li>tel : {{data[selectedUser].phone}}</li>
                    <li>web : {{data[selectedUser].website}}</li>
                </ul>
                <p>Adresse : {{data[selectedUser].address.street}}, {{data[selectedUser].address.suite}} {{data[selectedUser].address.city}} {{data[selectedUser].address.zipcode}}</p>
                <p>Entreprise : {{data[selectedUser].company.name}}</p>
            </div>
        </div>
    </section>

    `,
    data: function () {
        return {
            selectedUser: -1,
        };

    },
    props: ['data'],
    computed: {

    },
    methods: {
        console: function () {
            console.log(this.data[this.selectedUser].address.street)

        }
    },

};


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
    components: {
        information,
    }
});


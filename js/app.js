let information = {
    template: `
    <section>
        <div>
            <h1>Liste utilisateurs</h1>
            <p> Il y a {{this.users.length}} utilisateurs dans l'application</p>

            <select v-model="selectedUser" name="" id="">
                <option value="-1" selected>Selectionnez un utilisateur</option>
                <option v-for="(user, index) of users" :value="index">{{user.name}}</option>
            </select>
        </div>
        <div id="userinfo">
            <div v-if="selectedUser != -1">
                <h2>{{users[selectedUser].name}} ({{users[selectedUser].username}})</h2>
                <p>id n°{{users[selectedUser].id}}</p>
                <ul>
                    <li>email : {{users[selectedUser].email}}</li>
                    <li>tel : {{users[selectedUser].phone}}</li>
                    <li>web : {{users[selectedUser].website}}</li>
                </ul>
                <p>Adresse : {{users[selectedUser].address.street}}, {{users[selectedUser].address.suite}} {{users[selectedUser].address.city}} {{users[selectedUser].address.zipcode}}</p>
                <p>Entreprise : {{users[selectedUser].company.name}}</p>
                <hr>
                <button @click="tasksRequest()">Voir les taches</button> 
                <button @click="albumsRequest()">Voir les albums</button>
                 <button @click="articlesRequest()">Voir les articles</button>
            </div>
            
        </div>

    </section>

    `,
    data: function () {
        return {
            selectedUser: -1,
        };

    },
    props: ['users'],
    computed: {

    },
    methods: {
        tasksRequest: function () {
            this.$emit('tasks-request', this.selectedUser);
        },
        albumsRequest: function () {
            this.$emit('albums-request', this.selectedUser);
        },
        articlesRequest: function () {
            this.$emit('articles-request', this.selectedUser);
        },
    },

};

let tasklist = {
    template: `
    <section  v-if="task">
    <div>Task of {{currentuser.name}}</div>
        <ul>
            <li v-for="(task, index) of tasklist" :value="task.id" :style="{ color: taskColor(task.completed)}">
                {{task.title}} 
                <span @click="sendDeleteOrder(index)" class="suppr">
                <strong>Supprimer</strong>
                </span>
            </li>
        </ul>
    </section>
    `,
    props: ['task', 'currentuser', 'tasklist'],
    methods: {
        sendDeleteOrder: function (taskId) {
            //console.log(taskId)
            this.$emit('task-delete', taskId);
        },
        taskColor: function (completed) {
            return (completed) ? 'green' : 'red';
        }
    }
};

let albumlist = {
    template: `
    <div v-if="album">Album of {{currentuser.name}}</div>

    `,
    props: ['album', 'currentuser'],
};

let articlelist = {
    template: `
    <div v-if="article">Article of {{currentuser.name}}</div>

    `,
    props: ['article', 'currentuser'],
};

let vm = new Vue({
    el: '#app',
    data: {
        users: [],
        currentUser: [],
        task: false,
        album: false,
        article: false,
        taskList: [],

    },
    created: function () {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => this.users = json)
    },
    computed: {

    },
    filters: {

    },
    methods: {
        showtasks: function (user) {
            console.log('Request tasks from user ' + user);
            this.currentUser = this.users[user]
            this.task = true;
            this.album = false;
            this.article = false;
            fetch(`https://jsonplaceholder.typicode.com/todos?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => this.taskList = json);
        },
        showalbums: function (user) {
            console.log('Request albums from user ' + user)
            this.currentUser = this.users[user]
            this.task = false;
            this.album = true;
            this.article = false;
            fetch(`https://jsonplaceholder.typicode.com/albums?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => console.log(json));
        },
        showarticles: function (user) {
            console.log('Request articles from user ' + user)
            this.currentUser = this.users[user]
            this.task = false;
            this.album = false;
            this.article = true;
            fetch(`https://jsonplaceholder.typicode.com/posts?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => console.log(json));
        },
        taskDelete: function (index) {
            //console.log('requette de suppression task a l index ' + index)
            this.taskList.splice(index, 1)
        }
    },
    components: {
        information,
        tasklist,
        albumlist,
        articlelist,
    }
});


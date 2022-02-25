let information = {
    template: `
    <section>
        <div>
            <h1>Liste utilisateurs</h1>
            <p> Il y a {{this.users.length}} utilisateurs dans l'application</p>

            <select v-model="selectedUserId" name="" id="">
                <option value="-1" selected>Selectionnez un utilisateur</option>
                <option v-for="(user of users" :value="user.id">{{user.name}}</option>
            </select>
        </div>
        <div id="userinfo">
            <div v-if="selectedUserIndex != -1">
                <h2>{{users[selectedUserIndex].name}} ({{users[selectedUserIndex].username}})</h2>
                <p>id n°{{users[selectedUserIndex].id}}</p>
                <ul>
                    <li>email : {{users[selectedUserIndex].email}}</li>
                    <li>tel : {{users[selectedUserIndex].phone}}</li>
                    <li>web : {{users[selectedUserIndex].website}}</li>
                </ul>
                <p>Adresse : {{users[selectedUserIndex].address.street}}, {{users[selectedUserIndex].address.suite}} {{users[selectedUserIndex].address.city}} {{users[selectedUserIndex].address.zipcode}}</p>
                <p>Entreprise : {{users[selectedUserIndex].company.name}}</p>
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
            // ID de l'utilisateur séléctionné dans la boite de choix
            selectedUserId: -1,
        };

    },
    props: ['users'],
    computed: {
        selectedUserIndex: function () {
            // calcul de l'index de l'utilisasteur dans la liste des utilisateurs
            return this.users.findIndex(user => user.id == this.selectedUserId)
        }
    },
    methods: {
        // envoi de larequette d'affichage des taches (vers le composant principal)
        tasksRequest: function () {
            this.$emit('tasks-request', this.selectedUserId);
        },
        // envoi de la requette d'affichage des albums (vers le composant principal)
        albumsRequest: function () {
            this.$emit('albums-request', this.selectedUserId);
        },
        // envoi de la requette d'affichage des articles (vers le composant principal)
        articlesRequest: function () {
            this.$emit('articles-request', this.selectedUserId);
        },
    },

};

let tasklist = {
    template: `
    <section  v-if="task">
        <div>Task of {{currentuser.name}}
        </div>
        <ul>
            <li v-for="(task, index) of tasklist" :value="task.id" :style="{ color: taskColor(task.completed)}">
                {{task.title}} 
                <span @click="sendDeleteOrder(task.id)" class="suppr">
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
    <section v-if="album">
        <div>Liste des albums de {{currentuser.name}}</div>
        <ul>
        <li v-for="(album, index) of albumlist" :value="album.id">
            {{album.title}} 
            <span @click="showPictures(album.id, album.title)" class="suppr">
            <strong>Voir les photos</strong>
            </span>
        </li>
        </ul>
        <p v-if="photos.length >  0">Photos de l'album "{{albumTitle}}"</p>
        <div class="flex">
            <div v-for="photo in photos" class="card">
                <h4>{{photo.title}}</h4>
                <a :href="photo.url" target="_blank"><img :src="photo.thumbnailUrl" alt="" className="" /></a>
            </div>
        </div>
    </section>
    `,
    data: function () {
        return {
            albumId: -1,
            albumTitle: '',
        };

    },
    props: ['album', 'albumlist', 'photos', 'currentuser'],
    methods: {
        showPictures: function (albumId, albumTitle) {
            this.albumId = albumId;
            this.albumTitle = albumTitle;
            this.$emit('show-pictures', albumId);
            console.log(albumId);
        },
    },
};

let postlist = {
    template: `
    <section v-if="article">
        <div>Liste des articles de {{currentuser.name}}</div>
        <ul>
            <li v-for="(post, index) of postlist" :value="post.id">{{post.title}} 
                <span @click="showSinglePost(post.id)" class="suppr">
                    <strong>Voir l'article</strong>
                </span>
            </li>
        </ul>

        <article v-if="post">
            <h3>Article : {{post.title}}</h3>
            <p>{{post.body}}</p>
        </article>


        </section>
    `,
    props: ['article', 'postlist', 'post', 'currentuser', 'comments'],
    methods: {
        showSinglePost: function (postId) {
            console.log('ok')
            this.$emit('show-post', postId);
        },
    },
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
        albumList: [],
        photos: [],
        postList: [],
        post: [],
        comments: []
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
        // Affichage des taches de l'utilisateur selectionné
        showTasks: function (userId) {
            //console.log('Request tasks from user ' + userId);
            this.clearData()
            this.currentUser = this.users[this.users.findIndex(user => user.id == userId)]
            this.task = true;
            this.album = false;
            this.article = false;
            fetch(`https://jsonplaceholder.typicode.com/todos?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => this.taskList = json);
        },
        // Affichage des albums de l'utilisateur selectionné
        showAlbums: function (userId) {
            console.log('Request albums from user ' + userId)
            this.clearData()
            this.currentUser = this.users[this.users.findIndex(user => user.id == userId)]
            this.task = false;
            this.album = true;
            this.article = false;
            fetch(`https://jsonplaceholder.typicode.com/albums?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => this.albumList = json);
        },
        // recuperation des photo d'un album defini
        showPictures: function (albumId) {
            this.photos = [];
            console.log('ok' + albumId);
            fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
                .then((response) => response.json())
                .then((json) => this.photos = json);
        },
        // Affichage des articles de l'utilisateur selectionné
        showPosts: function (userId) {
            console.log('Request articles from user ' + userId)
            this.clearData()
            this.currentUser = this.users[this.users.findIndex(user => user.id == userId)]
            this.task = false;
            this.album = false;
            this.article = true;
            fetch(`https://jsonplaceholder.typicode.com/posts?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => this.postList = json);
        },
        // recuperation d'un post et de ses commentaires
        showSinglePost: function (postId) {
            this.post = [];
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((response) => response.json())
                .then((json) => this.post = json);
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
                .then((response) => response.json())
                .then((json) => this.comments = json);
        },
        // suppresion d'une tache de la liste (en local)
        taskDelete: function (taskId) {
            this.taskList.splice(this.taskList.findIndex(task => task.id == taskId), 1)
        },

        // suppression des data au changement d'utililsateur
        clearData: function () {
            console.log('data cleared')
            this.taskList = [];
            this.albumList = [];
            this.postList = [];
            this.photos = [];
            this.post = [];
            this.postList = [];
        }
    },
    components: {
        information,
        tasklist,
        albumlist,
        postlist,
    }
});


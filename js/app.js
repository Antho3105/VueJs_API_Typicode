let information = {
    template: `
    <section id="users">
        <div>
            <h1>Liste utilisateurs</h1>
            <p> Il y a {{this.users.length}} utilisateurs dans l'application</p>

            <select v-model="selectedUserId" @change="updateUser">
                <option value="-1" selected>Selectionnez un utilisateur</option>
                <option v-for="(user of users" :value="user.id">{{user.name}}</option>
            </select>
        </div>
        <div id="userinfo">
        <transition name="appear-rotate">
            <div v-if="userSelected.id" id="usercard">
                <h2>{{userSelected.name}} ({{userSelected.username}})</h2>
                <p>id n°{{userSelected.id}}</p>
                <ul>
                    <li>email : {{userSelected.email}}</li>
                    <li>tel : {{userSelected.phone}}</li>
                    <li>web : {{userSelected.website}}</li>
                </ul>
                <p>Adresse : {{userSelected.address.street}}, {{userSelected.address.suite}} {{userSelected.address.city}} {{userSelected.address.zipcode}}</p>
                <p>Entreprise : {{userSelected.company.name}}</p>
                <div id="buttons" class="flex">
                <button @click="tasksRequest()">Voir les taches</button> 
                <button @click="albumsRequest()">Voir les albums</button>
                 <button @click="articlesRequest()">Voir les articles</button>
                 </div>
            </div>
        </transition>
        </div>

    </section>

    `,
    data: function () {
        return {
            // ID de l'utilisateur séléctionné dans la boite de choix
            selectedUserId: -1,
            userSelected: [],
        };

    },
    props: ['users'],
    methods: {
        updateUser: function () {
            if (this.selectedUserId != -1) {
                this.userSelected = []
                fetch(`https://jsonplaceholder.typicode.com/users/${this.selectedUserId}`)
                    .then(response => response.json())
                    .then(json => this.userSelected = json)
                this.$emit('clear-request')
            } else {
                this.userSelected = []
                this.$emit('clear-request')
            };
        },
        // envoi de la requete d'affichage des taches (vers le composant principal)
        tasksRequest: function () {
            this.$emit('tasks-request', this.userSelected);
        },
        // envoi de la requete d'affichage des albums (vers le composant principal)
        albumsRequest: function () {
            this.$emit('albums-request', this.userSelected);
        },
        // envoi de la requete d'affichage des articles (vers le composant principal)
        articlesRequest: function () {
            this.$emit('articles-request', this.userSelected);
        },
    },

};

let tasklist = {
    template: `
    <transition name="appear-up">
    <section v-if="task" id="data-tasks">
        <div><strong>Taches de {{currentuser.name}} :</strong>
        </div>
        <button v-if="displayAll" @click="displayAllTask()">Masquer les tâches terminées
        </button>
        <button v-else @click="displayAllTask()">Afficher toutes les tâches
        </button> 
        <input type="text" placeholder="ajouter une tâche" v-model="newTask" @keypress.enter="addTask()">
        <br>
        <button v-if="!onDelete" @click="activateTaskDelete()">Supprimer une tâche
        </button>
        <button v-else @click="activateTaskDelete()">Annuler
        </button>
        
        <ul id="classlit">
            <li v-for="task of tasklist" :classname="task.id" :style="taskDisplay(task.completed)">
                <input type="checkbox" v-if="onDelete" @click="taskDelete(task.id)">
                <input type="checkbox" v-if="!onDelete" v-model="task.completed" v-bind:id="task.id">
                <span :style="taskStyle(task.completed)">{{task.title}}</span> 
            </li>
        </ul>
    </section>
    </transition>
    `,
    data: function () {
        return {
            displayAll: true,
            newTask: '',
            onDelete: false,
        }
    },
    props: ['task', 'currentuser', 'tasklist'],
    watch: {
        task: function () {
            if (!this.task) {
                this.displayAll = true;
                this.onDelete = false;
            }
        }
    },
    methods: {
        activateTaskDelete: function () {
            this.onDelete = !this.onDelete;
        },
        // suppression d'une tache
        taskDelete: function (taskId) {
            if (confirm('voulez vous supprimer la tache ' + taskId)) {
                this.tasklist.splice(this.tasklist.findIndex(task => task.id == taskId), 1)
                this.onDelete = !this.onDelete;
            }
        },
        displayAllTask: function () {
            this.displayAll = !this.displayAll;
        },
        taskDisplay: function (completed) {
            if (!this.displayAll && completed) return 'display: none';
            else return 'display: block';
        },
        // mise en forme conditionnelles de taches
        taskStyle: function (completed) {
            return (completed) ? "color: green; textDecoration: line-through" : "color: red";
        },
        // ajout nouvelle tâche
        addTask: function () {
            let newId = Math.max(...this.tasklist.map(elem => elem.id)) + 1;
            this.tasklist.push({
                completed: false,
                id: newId,
                title: this.newTask,
                userId: this.currentuser.id
            });
            this.newTask = '';
        }
    }
};

let albumlist = {
    template: `
    <transition name="appear-up">
    <section v-if="album" id="data-albums">
        <div>Liste des albums de {{currentuser.name}}
        </div>
        <ul>
            <li v-for="album of albumlist">
             {{album.title}} 
                <span @click="showPictures(album.id, album.title)" class="suppr">
                <strong>Voir les photos</strong>
                </span>
            </li>
        </ul>
        <p v-if="photos.length >  0" style="textAlign:center"> <strong>Photos de l'album "{{albumTitle}}"</strong>
        </p>
        <transition-group name="appear-up" class="flex" tag="div">
            <figure v-for="photo in photos" class="image" v-bind:key="photo.id">
                <a :href="photo.url" target="_blank"><img :src="photo.thumbnailUrl" :title="photo.title" alt="image"/></a>
                <figcaption>{{photo.title}}</figcaption>
            </figure>
        </transition-group>
    </section>
    </transition>
    `,
    data: function () {
        return {
            albumId: -1,
            albumTitle: '',
        };
    },
    props: ['album', 'albumlist', 'photos', 'currentuser'],
    methods: {
        // envoi de la requete d'affichage des photos d'un album
        showPictures: function (albumId, albumTitle) {
            this.albumId = albumId;
            this.albumTitle = albumTitle;
            this.$emit('show-pictures', albumId);
        },
    },
};

let postlist = {
    template: `
    <transition name="appear-up">
        <section v-if="article" class="posts" id="data-posts">
            <div>
                <h2>Liste des articles de {{currentuser.name}}</h2
                <ul>
                    <li title="Lire l'article" v-for="post of postlist" @click="showSinglePost(post.id)">{{post.title}}
                    </li>
                </ul>
            </div>

            <transition name="appear-up">
                <article v-if="post.body">
                    <h3 style="textAlign:center">Article : {{post.title}}</h3>
                        <p>{{post.body}}</p>
                </article>
            </transition>
            <transition-group v-if="comments" name="appear-up" class="comment" tag="div">
                <figure v-for="comment of comments" v-bind:key="comment.id">
                    <blockquote>
                        <p>"{{comment.body}}"</p>
                        <figcaption>{{comment.name}}
                            <cite>{{comment.email}}</cite>
                        </figcaption>
                    </blockquote>
                </figure>
            </transition-group>
        </section>
    </transition>

    `,
    props: ['article', 'postlist', 'post', 'currentuser', 'comments'],
    methods: {
        // envoi de la requete d'affichage d'un article
        showSinglePost: function (postId) {
            this.$emit('show-post', postId);
        },
    },
};

// composant principal
let vm = new Vue({
    el: '#app',
    data: {
        users: [],
        currentUser: [],
        // booleen de mode tache
        task: false,
        // booleen de mode album
        album: false,
        // booleen de mode article
        article: false,
        taskList: [],
        albumList: [],
        photos: [],
        postList: [],
        post: [],
        comments: []
    },
    created: function () {
        // recuperation des infos des utilisateurs
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
        showTasks: function (user) {
            this.clearData();
            this.currentUser = user;
            this.task = true;
            this.album = false;
            this.article = false;
            fetch(`https://jsonplaceholder.typicode.com/todos?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => this.taskList = json);
        },
        // Affichage des albums de l'utilisateur selectionné
        showAlbums: function (user) {
            this.clearData()
            this.currentUser = user;
            this.task = false;
            this.album = true;
            this.article = false;
            fetch(`https://jsonplaceholder.typicode.com/albums?userId=${this.currentUser.id}`)
                .then((response) => response.json())
                .then((json) => this.albumList = json);
        },
        // recuperation des photos d'un album defini
        showPictures: function (albumId) {
            this.photos = [];
            fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
                .then((response) => response.json())
                .then((json) => this.photos = json);
        },
        // Affichage des articles de l'utilisateur selectionné
        showPosts: function (user) {
            this.clearData()
            this.currentUser = user;
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
            this.comments = [];
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
                .then((response) => response.json())
                .then((json) => this.post = json);
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
                .then((response) => response.json())
                .then((json) => this.comments = json);
        },
        // suppression des data au changement d'utililsateur ou de mode d'affichage
        clearData: function () {
            this.taskList = [];
            this.albumList = [];
            this.postList = [];
            this.photos = [];
            this.post = [];
            this.postList = [];
            this.comments = [];
            this.currentUser = [];
            this.task = false;
            this.album = false;
            this.article = false;
        }
    },
    components: {
        information,
        tasklist,
        albumlist,
        postlist,
    }
});
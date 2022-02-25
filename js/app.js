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

                <button @click="tasksRequest()">Voir les taches</button> 
                <button @click="albumsRequest()">Voir les albums</button>
                 <button @click="articlesRequest()">Voir les articles</button>
            </div>
            <hr>
            
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
            // recuperation de l'index de l'utilisateur dans la liste des utilisateurs
            return this.users.findIndex(user => user.id == this.selectedUserId)
        },
        // stockage de l'utilisateur actuel (pour renvoi au root) 
        currentUser: function () {
            return this.users[this.selectedUserIndex]
        }
    },
    methods: {
        // envoi de la requete d'affichage des taches (vers le composant principal)
        tasksRequest: function () {
            this.$emit('tasks-request', this.currentUser);
        },
        // envoi de la requete d'affichage des albums (vers le composant principal)
        albumsRequest: function () {
            this.$emit('albums-request', this.currentUser);
        },
        // envoi de la requete d'affichage des articles (vers le composant principal)
        articlesRequest: function () {
            this.$emit('articles-request', this.currentUser);
        },
    },

};

let tasklist = {
    template: `
    <section  v-if="task">
        <div>Taches de {{currentuser.name}} :
        </div>
        <button v-if="displayAll" @click="displayTask()">
        Masquer les tâches terminées
        </button>
        <button v-else @click="displayTask()">
        Afficher toutes les tâches
        </button>
        <input type="text" placeholder="ajouter une tâche" v-model="newTask" @keypress.enter="addTask()">
        <ul>
            <li v-for="(task, index) of tasklist" :classname="task.id" :style="{ color: taskColor(task.completed), display: taskDisplay(task.completed)}">
            <input type="checkbox" id="checkbox" v-model="task.completed" v-bind:id="task.id">
                {{task.title}} 
                <span @click="taskDelete(task.id)" class="suppr">
                <strong>Supprimer</strong>
                </span>
            </li>
        </ul>
    </section>
    `,
    data: function () {
        return {
            displayAll: true,
            newTask: '',
        }
    },
    props: ['task', 'currentuser', 'tasklist'],
    methods: {
        // envoi requete de suppression d'une tache
        taskDelete: function (taskId) {
            this.$emit('task-delete', taskId);
        },
        displayTask: function () {
            this.displayAll = !this.displayAll;
        },
        taskDisplay: function (completed) {
            if (!this.displayAll && completed) return 'none';
            else return 'block';
        },
        // mise en forme conditionnelles de taches
        taskColor: function (completed) {
            return (completed) ? 'green' : 'red';
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
    <section v-if="album">
        <div>Liste des albums de {{currentuser.name}}</div>
        <ul>
        <li v-for="(album, index) of albumlist">
            {{album.title}} 
            <span @click="showPictures(album.id, album.title)" class="suppr">
            <strong>Voir les photos</strong>
            </span>
        </li>
        </ul>
        <p v-if="photos.length >  0">Photos de l'album "{{albumTitle}}"</p>
        <div class="flex">
            <figure v-for="photo in photos" class="image">
                <a :href="photo.url" target="_blank"><img :src="photo.thumbnailUrl" :title="photo.title" alt="image"/></a>
                <figcaption>{{photo.title}}</figcaption>
            </figure>
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
    <section v-if="article" class="posts">
        <div>Liste des articles de {{currentuser.name}}</div>

        <ul>
            <li title="Lire l'article" v-for="(post, index) of postlist" @click="showSinglePost(post.id)">{{post.title}}
            </li>
        </ul>

        <article v-if="post.body">
            <h3>Article : {{post.title}}</h3>
            <p>{{post.body}}</p>
        </article>

        <div v-if="comments">
            <figure v-for="comment of comments" class="comment">
                <blockquote>
                    <p>"{{comment.body}}"</p>
                    <figcaption>{{comment.name}}
                        <cite>{{comment.email}}</cite>
                    </figcaption>
                </blockquote>
            </figure>
        </div>
        </section>
    `,
    props: ['article', 'postlist', 'post', 'currentuser', 'comments'],
    methods: {
        // envoi de la requete de'affichage d'un article
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
        // suppresion d'une tache de la liste (en local)
        taskDelete: function (taskId) {
            this.taskList.splice(this.taskList.findIndex(task => task.id == taskId), 1)
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
        }
    },
    components: {
        information,
        tasklist,
        albumlist,
        postlist,
    }
});


<div align='center'>

<h1>Basic Discussion Board Single Page Application</h1>
<p>This is a basic project to showcase my skills in creating applications in both asp.net and angular</p>

<h4> <span> · </span> <a href="https://github.com/ChristianClose/Discussions/blob/master/README.md"> Documentation </a> <span> · </span> <a href="https://github.com/ChristianClose/Discussions/issues"> Report Bug </a> <span> · </span> <a href="https://github.com/ChristianClose/Discussions/issues"> Request Feature </a> </h4>


</div>

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
- [Contact](#handshake-contact)


## :star2: About the Project

### :camera: Screenshots
<div align="center"> <a href=""><img src="https://i.imgur.com/3QXwSav.png" alt='image' width='800'/></a> </div>
<div align="center"> <a href=""><img src="https://i.imgur.com/yoeAXOV.png" alt='image' width='800'/></a> </div>
<div align="center"> <a href=""><img src="https://i.imgur.com/lrJPZb0.png" alt='image' width='800'/></a> </div>
<div align="center"> <a href=""><img src="https://i.imgur.com/e583REk.png" alt='image' width='800'/></a> </div>
<div align="center"> <a href=""><img src="https://i.imgur.com/Hdd5esY.png" alt='image' width='800'/></a> </div>


### :space_invader: Tech Stack
<details> <summary>Client</summary> <ul>
<li><a href="">Angular | TypeScript</a></li>
</ul> </details>
<details> <summary>Server</summary> <ul>
<li><a href="">ASP.NET Core | C#</a></li>
</ul> </details>
<details> <summary>Database</summary> <ul>
<li><a href="">SQLITE</a></li>
</ul> </details>

### :dart: Features
- Fulling Fuctional CRUD API

### API Documentation

Account
---
#### Register Account
```
POST
url:5001/api/Account/Register
```

#### Login Account
```
POST
url:5001/api/Account/Login
```
---

Posts
---
#### Create Post
```
POST
url:5001/api/Posts/Create
```
#####Request Body
```javascript
{
  "title": string,
  "message": string
}
```

#### Get Posts
```
GET
url:5001/api/Posts/
```


#### Get Single Post
```
GET
url:5001/api/Posts/{post_id}
```

#### Update Post
```
PUT
url:5001/api/Posts/Update
```

## :handshake: Contact

Christian Close - - Christianclose55@gmail.com

Project Link: [https://github.com/ChristianClose/Discussions](https://github.com/ChristianClose/Discussions)

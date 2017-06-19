# Keeper Backend

* Установить зависимости `npm install`

* Установить и запустить [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

* Создать в корне папки проекта файл с названием credentials.js со следующим содержимым:
```
module.exports = {
    mongo: 'mongodb://localhost:27017/keeper',
    jwtSecret: 'random string'
};
```

* Запустить Backend `npm start`


# BOOKSTORE BACKEND

Berikut adalah fungsi dan kegunaan dari file yang terdapat dalam aplikasi ini:

- index/controller: berfungsi sebagai endpoint
- repository: berfungsi sebagai fungsi query
- service: berfungsi sebagai pengolahan data/logic


## Susunan Aplikasi
- expressJS
- postgreSQL

## Instalasi
Tahapan awal dalam instalasi aplikasi dalah mengintal dependecies yang digunakan

```sh
npm i
```

kemudian copy file 
```
.env.example
```
menjadi file
```
.env
```
dan isi variabel tersebut sesuai dengan konfigurasi di environment masing-masing

kemudian jalan command untuk migrasi database, untuk membuat table di database yang sudah di inialisasikan pada `.env`, command tersebut adalah

```
npm run migration
```

jika sudah melakukan migrasi makan tinggal menjalankan server menggunakan command

```
npm run dev
```
>Note: `APLIKASI INI BELUM SEMPURNA, MASIH BANYAK API YANG BELUM TERSELESAIKAN`
const express = require("express"),
  logger = require("morgan"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  database = require("./db/mongo"),
  db = database.get("short-url"),
  fs = require("fs"),
  path = require("path"),
  fetch = require("node-fetch"),
  mime = require("mime"),
  pug = require("pug"),
  { y2mateA, y2mateV } = require("./lib/y2mate");
(db2 = database.get("html-gen")),
  (db3 = database.get("pug-gen")),
  (obfus = require("javascript-obfuscator"));

const htmlCode = async (url, costum) => {
  if (!url) return new Error(`code html invalid`);
  if (!url.includes("html"))
    return SyntaxError(`Code HTML Invalid, Enter the code correctly!`);
  url = encodeURIComponent(url);
  return new Promise(async (resolve, reject) => {
    let ni = await require("axios").get(
      `https://sl.rzkyfdlh.tech/createhtml?code=${url}&name=${
        costum ? costum : ""
      }`
    );
    resolve(ni.data);
  });
};
const app = express();
const port = process.env.PORT || 3000;

const fetchJson = (url, options) =>
  new Promise(async (resolve, reject) => {
    fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((err) => {
        reject(err);
      });
  });

const isUrl = (url) => {
  return url.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
      "gi"
    )
  );
};
const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await require("axios")({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};
function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.set("json spaces", 2);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "pug");
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", async (req, res) => {
  let jumlahdb = await db.count();
  res.render(__dirname + "/public/index.pug", { jumlahdb });
});

app.use("/encjavascript", async (req, res) => {
  try {
    const code = decodeURIComponent(req.query.code);
    if (!code)
      return res.json({ status: false, message: "masukan code javascript" });
    var obfuscationResult = obfus.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      disableConsoleOutput: false,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1,
    });
    const codehtml = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"/>
<style>
.copiedtext {
  position: absolute;
  left: 0; top: 0; right: 0;
  text-align: center;
  opacity: 0;
  transform: translateY(-1em);
  color: #000;
  transition: all .500s;
}
.copied .copiedtext {
  opacity: 1;
  transform: translateY(-2em);
}

body {
  text-align: center;
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  color: #444;
  line-height: 1.6;
}
h1 {
  margin: 1.75em auto 1.25em;
}
textarea,
button {
  font-size: 1em;
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
}
.bottom {
  padding-bottom: 140px;
}
textarea {
  display: block;
  width: 300px;
  max-width: 100%;
  height: 75px;
  margin: 2em auto 1.5em;
  background: #F2F2F6;
  border: 1px solid #ddd;
  padding: 10px 15px;
  resize: vertical;
}
[id="cleared"] {
  margin-top: 4em;
}
textarea:focus {
  border-color: #8fa423;
}
button {
  position: relative;
  padding: 8px 20px;
  border: none;
  font-size: 0.835em;
  letter-spacing: 0.125em;
  font-weight: bold;
  color: #FFF;
  background: #8fa423;
  transition: background .275s;
}
button:hover,
button:focus {
  background: #74861A;
}

p {
  margin-top: 3.25em;
  font-size: .825em;
  color: #777;
  font-weight: bold;
  letter-spacing: .01em
}

p a{
   text-decoration: none;
}
</style>
</head>
<body>
<h1>Click Button To Get Code Encrypt JavaScript</h1>
<div class="bottom">
<textarea id="to-copy" spellcheck="false">${obfuscationResult.getObfuscatedCode()}</textarea>
<b>Original code: <b>
<textarea disabled>${code}</textarea>
<br><br><br><br><br><br>
<button id="copy" type="button">Copy in clipboard<span class="copiedtext" aria-hidden="true">Build By RzkyFdlh</span></button>
</div>
<p>Made With By <a href="https://wa.me/6282387804410">Rizky Fadilah</a></p>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
<script>
var toCopy  = document.getElementById( 'to-copy' ),
    btnCopy = document.getElementById( 'copy' )

btnCopy.addEventListener( 'click', function(){
  toCopy.select()
  if ( document.execCommand( 'copy' ) ) {
      btnCopy.classList.add( 'copied' );
     alert("Succes Copy Code")
      var temp = setInterval( function(){
        btnCopy.classList.remove( 'copied' );
        clearInterval(temp);
      }, 2000 );
  } else {
    console.info( 'document.execCommand went wrong…' )
  }
  return false;
} );
</script>
</body>
</html>`;
    awas = await htmlCode(codehtml);
    res.json({
      status: true,
      result: {
        succes: "get code encrypt here " + awas.result.url,
        message: "ambil kode encrypt pada link diatas",
      },
    });
  } catch (e) {
    res.json({ status: false, error: String(e) });
  }
});
app.get("/data", async (req, res) => {
  const teksnya = req.query.data;
  const datanya = req.query.get;
  const apikey = req.query.apikey;
  if (!apikey) return res.json({ status: true, value: await db.count() });
  if (apikey !== "ikiapi")
    return res.json({ status: false, message: "ngapain cuy" });
  try {
    hasil = datanya ? await db.find({ [teksnya]: datanya }) : await db.find();
    datanya
      ? res.json({ result: hasil })
      : res.json({ db: hasil, count: await db.count() });
  } catch (e) {
    res.json({
      status: false,
      message: "error",
      error: String(e),
    });
  }
});
var token;
app.post("/ytdl/downloadmp3", async (req, res) => {
  var urlny = req.body.url;
  var type = req.body.type;
  var quality = req.body.quality;
  if (!req.body.token.includes(token))
    return res.json({
      status: false,
      message: "Page not found",
    });
  if (!urlny.includes("youtu"))
    return res.json({ status: false, message: "link youtube invalid" });
  if (!isUrl(req.body.url))
    return res.json({ status: false, message: "link invalid" });
  try {
    var yt =
      type == "audio"
        ? await y2mateA(
            req.body.url,
            ["256", "128"].includes(quality) ? quality : "256"
          )
        : await y2mateV(
            req.body.url,
            ["144", "1080", "480", "720", "360", "240"].includes(quality)
              ? quality
              : "1080"
          );
    var link = yt[0].link;
    var judul = yt[0].judul;
    var filepath = yt[0].output;
    fs.writeFileSync(`./mp3/${filepath}`, await getBuffer(link));
    var file = __dirname + "/mp3/" + filepath;
    var filename = path.basename(file);
    var mimetype = mime.getType(file);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=RzkyFdlh " +
        quality +
        " " +
        type.toUpperCase() +
        " Downloader - " +
        filename
    );
    res.setHeader("Content-type", mimetype);
    var filestream = fs.createReadStream(file);
    return filestream.pipe(res);
    //return res.redirect("https://sl.rzkyfdlh.tech/ytdl")
  } catch (e) {
    console.error(e);
    res.json({ status: false, error: String(e) });
  }
});
app.post("/ytdl/result", async (req, res) => {
  var urlny = req.body.url;
  if (!req.body.token.includes(token))
    return res.json({
      status: false,
      message: "Page not found",
    });
  if (!urlny.includes("youtu"))
    return res.json({ status: false, message: "link youtube invalid" });
  if (!isUrl(req.body.url))
    return res.json({ status: false, message: "link invalid" });
  try {
    var yt = await y2mateA(req.body.url, "256");
    var yt2 = await y2mateV(req.body.url, "1080");
    var link = yt[0].link;
    var urlna = await fetchJson(`https://sl.rzkyfdlh.tech/create?url=${link}`);
    var judul = yt[0].judul;
    var filepath = yt[0].output;
    res.render(__dirname + "/public/ytdl/result.ejs", {
      title: judul,
      img: yt[0].thumb,
      token,
      sizeaudio: yt[0].size,
      sizevideo: yt2[0].size,
      link: urlna.result.url,
      url: req.body.url,
    });
  } catch (e) {
    return res.json({ status: false, message: String(e) });
  }
});
app.use("/ytdl", async (req, res) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    req.ip ||
    req.connection.remoteAddress;
  var visit = await fetchJson(`https://api.countapi.xyz/hit/sl.rzkyfdlh.tech`);
  token = makeid(18);
  res.render(__dirname + "/public/ytdl/index.ejs", {
    visit: visit.value,
    token,
  });
});

app.use("/delete/:id", async (req, res) => {
  db.findOne({
    delete: req.params.id,
  }).then((result) => {
    if (result == null)
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    if (req.method == "POST") {
      db.findOneAndDelete({
        delete: req.params.id,
      }).then((result) => {
        if (result == null)
          return res.status(404).json({
            status: false,
            message: "ID not found",
          });
        else
          res.status(200).json({
            status: true,
            message: "Success delete short url",
          });
      });
    } else res.sendFile(__dirname + "/public/delete.html");
  });
});

app.use("/pug/delete/:id", async (req, res) => {
  db3
    .findOne({
      delete: req.params.id,
    })
    .then((result) => {
      if (result == null)
        return res.status(404).json({
          status: false,
          message: "ID not found",
        });
      if (req.method == "POST") {
        db3
          .findOneAndDelete({
            delete: req.params.id,
          })
          .then((result) => {
            if (result == null)
              return res.status(404).json({
                status: false,
                message: "ID not found",
              });
            else
              res.status(200).json({
                status: true,
                message: "Success delete pug code",
              });
          });
      } else res.sendFile(__dirname + "/public/delete.html");
    });
});

app.use("/web/delete/:id", async (req, res) => {
  db2
    .findOne({
      delete: req.params.id,
    })
    .then((result) => {
      if (result == null)
        return res.status(404).json({
          status: false,
          message: "ID not found",
        });
      if (req.method == "POST") {
        db2
          .findOneAndDelete({
            delete: req.params.id,
          })
          .then((result) => {
            if (result == null)
              return res.status(404).json({
                status: false,
                message: "ID not found",
              });
            else
              res.status(200).json({
                status: true,
                message: "Success delete web",
              });
          });
      } else res.sendFile(__dirname + "/public/delete.html");
    });
});

app.get("/:id", async (req, res, next) => {
  db.findOne({
    id: req.params.id,
  }).then((result) => {
    if (result == null) return next();
    else res.redirect(result.url);
  });
});
app.get("/web/:id", async (req, res, next) => {
  db2
    .findOne({
      id: req.params.id,
    })
    .then((result) => {
      if (result == null) return next();
      else res.send(result.code.toString("html"));
    });
});

app.get("/pug/:id", async (req, res, next) => {
  db3
    .findOne({
      id: req.params.id,
    })
    .then((result) => {
      if (result == null) return next();
      else res.send(result.code);
    });
});

app.get("/create", async (req, res) => {
  const ur = req.originalUrl,
    costum = req.query.costum,
    url = ur.replace("/create?url=", "").split("&costum")[0];
  console.log(req.originalUrl);
  if (!url)
    return res.status(400).json({
      status: false,
      message: "Masukkan parameter url",
    });

  if (!isUrl(url))
    return res.status(400).json({
      status: false,
      message: "Harap masukkan url parameter yang valid",
    });
  const id = costum ? costum : makeid(6);
  const delete_id = makeid(18);
  const check = await db.findOne({
    id,
  });
  if (check)
    return res.status(400).json({
      status: false,
      message:
        "Id tersebut sudah ada, silahkan coba lagi atau ganti dengan yang lain",
    });
  let urls = new URL(url);

  db.insert({
    id,
    url: urls.href,
    delete: delete_id,
  })
    .then(() =>
      res.status(200).json({
        status: true,
        result: {
          url: "https://sl.rzkyfdlh.tech/" + id,
          delete: "https://sl.rzkyfdlh.tech/delete/" + delete_id,
        },
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    });
});
app.get("/createpug", async (req, res) => {
  const pugnya = req.query.code,
    nameny = req.query.name;
  console.log(req.query.code);
  if (!pugnya)
    return res.status(400).json({
      status: false,
      message: "Masukkan parameter code pug",
    });
  try {
    const htmlnya = await pug.render(pugnya);

    const idnya = nameny ? nameny : makeid(4);
    const delete_idnya = makeid(18);
    const checknya = await db3.findOne({
      id: idnya,
    });
    if (checknya)
      return res.status(400).json({
        status: false,
        message:
          "Name tersebut sudah ada, silahkan coba lagi atau ganti dengan yang lain",
      });
    db3
      .insert({
        id: idnya,
        code: htmlnya,
        delete: delete_idnya,
      })
      .then(() =>
        res.status(200).json({
          status: true,
          creator: "RzkyFdlh",
          type: "pug",
          result: {
            url: "https://sl.rzkyfdlh.tech/pug/" + idnya,
            delete: "https://sl.rzkyfdlh.tech/pug/delete/" + delete_idnya,
          },
        })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: false,
          message: "Internal server error",
        });
      });
  } catch (e) {
    return res.json({ status: false, error: String(e) });
  }
});
app.get("/createhtml", async (req, res) => {
  const htmlny = req.query.code,
    nameny = req.query.name;
  console.log(req.query.code);
  if (!htmlny)
    return res.status(400).json({
      status: false,
      message: "Masukkan parameter code html",
    });

  const idny = nameny ? nameny : makeid(4);
  const delete_idny = makeid(18);
  const checkny = await db2.findOne({
    id: idny,
  });
  if (checkny)
    return res.status(400).json({
      status: false,
      message:
        "Name tersebut sudah ada, silahkan coba lagi atau ganti dengan yang lain",
    });
  db2
    .insert({
      id: idny,
      code: htmlny,
      delete: delete_idny,
    })
    .then(() =>
      res.status(200).json({
        status: true,
        creator: "RzkyFdlh",
        type: "html",
        result: {
          url: "https://sl.rzkyfdlh.tech/web/" + idny,
          delete: "https://sl.rzkyfdlh.tech/web/delete/" + delete_idny,
        },
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    });
});
app.post("/create2", async (req, res) => {
  const re = req.body.url,
    tum = req.body.costum,
    rel = re;
  console.log(rel + "\n" + tum);
  if (!rel)
    return res.status(400).json({
      status: false,
      message: "Masukkan parameter url",
    });

  if (!isUrl(rel))
    return res.status(400).json({
      status: false,
      message: "Harap masukkan url parameter yang valid",
    });
  const red = tum ? tum : makeid(6);
  const del = makeid(18);
  const cr = await db.findOne({
    id: red,
  });
  if (cr)
    return res.status(400).json({
      status: false,
      message:
        "Id tersebut sudah ada, silahkan coba lagi atau ganti dengan yang lain",
    });
  let asw = new URL(rel);
  db.insert({
    id: red,
    url: asw.href,
    delete: del,
  })
    .then(() =>
      res.status(200).json({
        status: true,
        result: {
          id: red,
          delete: del,
        },
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    });
});

// Handling 404
app.use(async function (req, res, next) {
  var visit = await fetchJson(`https://api.countapi.xyz/hit/anu.com`);
  res.status(404).render(__dirname + "/public/404.ejs", { visit: visit.value });
});

app.listen(port, () => {
  console.log(`Connected!\nApp listening at http://localhost:${port}`);
});
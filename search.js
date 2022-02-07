const BASE_URL = " https://collectionapi.metmuseum.org/public/collection/v1";

//search Met API using filters
const searchArt = async (keyword, dateBegin, dateEnd, isPublic) => {
  try {
    if (dateBegin && dateEnd && !isPublic) {
      const res = await axios.get(
        `${BASE_URL}/search?q=${keyword}&dateBegin=${dateBegin}&dateEnd=${dateEnd}`
      );
      let art = res.data;
      return art;
    } else if (dateBegin && dateEnd && isPublic) {
      const res = await axios.get(
        `${BASE_URL}/search?q=${keyword}&dateBegin=${dateBegin}&dateEnd=${dateEnd}&isOnView=true`
      );
      let art = res.data;
      return art;
    } else if (!dateBegin && !dateEnd && isPublic) {
      const res = await axios.get(
        `${BASE_URL}/search?q=${keyword}&isOnView=true`
      );
      let art = res.data;
      return art;
    } else {
      const res = await axios.get(`${BASE_URL}/search?q=${keyword}`);
      let art = res.data;
      return art;
    }
  } catch (err) {
    console.log("Doh!");
    console.error(err);
  }
};

//artworks array
let artworks = [];

//call Met API using 5 ObjectIDs
const artResults = async (endpoints) => {
  document.getElementById("search-result").innerHTML = "Loading...";
  artworks.length = 0;
  await axios
    .all(
      endpoints.map((endpoint) => axios.get(`${BASE_URL}/objects/${endpoint}`))
    )
    .then((res) => {
      res.forEach((r) => {
        if (r) {
          artworks.push(r.data);
        } else {
          console.log("Dang!");
        }
      });
    });
    //clear Results container
  document.getElementById("search-result").innerHTML = "";
  return artworks;
};

//submit form
var form = document.getElementById("searchMetApi");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  //get values
  var keyword = document.getElementById("searchKeyword").value;
  var dateBegin =
    document.getElementById("searchBegin").value === ""
      ? false
      : document.getElementById("searchBegin").value;
  var dateEnd =
    document.getElementById("searchEnd").value === ""
      ? false
      : document.getElementById("searchEnd").value;
  var isPublic = document.getElementById("searchPublic").checked;

  //search error
  const error = (document.getElementById("search-result").innerHTML =
    "No Results, please try again.");

  //search
  const data = await searchArt(keyword, dateBegin, dateEnd, isPublic).then(data => data).catch(error);
  var endpoints = data.objectIDs.slice(0, 5);
  const results = await artResults(endpoints);
  const sr = document.getElementById("search-result");
  //create cards
  artworks.map((art) => {
    let div = document.createElement("div");
    let name = document.createElement("h2");
    let picContainer = document.createElement("div");
    let picture = document.createElement("img");
    let artist = document.createElement("p");
    let department = document.createElement("p");

    div.classList.add("card");
    name.classList.add("title");
    picContainer.classList.add("art-container");
    picture.classList.add("art-img");
    artist.classList.add("artist");
    department.classList.add("dep");

    name.innerHTML += art.title;
    picture.src = `${art.primaryImageSmall}`;
    artist.innerHTML = !art.artistDisplayName
      ? "<strong>Artist:</strong> <br> Unknown"
      : `<strong>Artist:</strong> <br>${art.artistDisplayName}`;
    department.innerHTML = `<strong>Department:</strong> <br>${art.department}`;
    div.appendChild(name);
    picContainer.appendChild(picture);
    div.appendChild(picContainer);
    div.appendChild(artist);
    div.appendChild(department);
    sr.appendChild(div);
  });
});

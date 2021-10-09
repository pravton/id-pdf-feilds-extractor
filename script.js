const pdfInput = document.querySelector('#pdf-input');
const tableBody = document.querySelector('.table-body');

let feildKeys;

const handleUpload = () => {
  const [file] = document.querySelector('input[type=file]').files;
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // this will then display a text file
    // content.innerText = reader.result;
    console.log(reader.result);
    feildKeys = pdfform().list_fields(reader.result);

  }, false);

  if (file) {
    reader.readAsArrayBuffer(file);
  }
}

pdfInput.addEventListener('change', handleUpload);

// get id's from html content
const parseIdForm = document.querySelector('#parse-id-form');

const parseIdHandler = (event) => {

  event.preventDefault();
  const formData = new FormData(event.target);
  const htmlContent = formData.get('html-content');
  tableBody.innerHTML = '';

  if(document.querySelector('input[type=file]').files) {

    if(htmlContent.length > 0) {
      const allIdsWithStr = [...htmlContent.matchAll(/ID=".(.*?)"/gi)];

      console.log(allIdsWithStr);
      const allIds = allIdsWithStr.map(id => {
        return id[0].replace('ID=', '').replaceAll('"', '').replace('id=', '');
      });
    

      allIds.forEach((id, i) => {
        const selectEl = document.createElement('select');
        selectEl.setAttribute('class', 'select2');

        for(key in feildKeys) {
          const trEl = document.createElement('option');
          trEl.setAttribute('value', key);
          trEl.textContent = key;
          selectEl.appendChild(trEl);
        }

        const tableBody = document.querySelector('.table-body');
        const trEl = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        td1.innerHTML = `<p>${id}<p>`;
        trEl.appendChild(td1);
        td2.appendChild(selectEl);
        trEl.appendChild(td2);
        tableBody.appendChild(trEl);

        $('.select2').select2();
      });
      
    } else {
      alert('Paste some data');
    }
  }
}

parseIdForm.addEventListener('submit', parseIdHandler);



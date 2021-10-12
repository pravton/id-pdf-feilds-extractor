const pdfInput = document.querySelector('#pdf-input');
const tableBody = document.querySelector('.table-body');
const generateBtn = document.querySelector('#generateCSV');

let feildKeys;

const handleUpload = () => {
  const [file] = document.querySelector('input[type=file]').files;
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // this will then display a text file
    // content.innerText = reader.result;
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

      const allIds = allIdsWithStr.map(id => {
        return id[0].replace('ID=', '').replaceAll('"', '').replace('id=', '');
      });
    

      allIds.forEach((id, i) => {
        const selectEl = document.createElement('select');
        selectEl.setAttribute('class', 'select2');
        selectEl.setAttribute('idPdfIndex', i);
        const opEl = document.createElement('option');
        opEl.textContent = '---------';
        selectEl.appendChild(opEl);

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
        td1.innerHTML = `<p idIndex="${i}">${id}<p>`;
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

const csvDownloadHandler = () => {
  const allIds = document.querySelectorAll('[idIndex]');
  const csvArray = [];
  allIds.forEach(el => {
    const pdfElId = document.querySelector(`[idpdfindex="${el.attributes.idIndex.value}"]`);
    const elArray = [el.textContent, pdfElId.value];
    csvArray.push(elArray);
  });

  const csv = csvArray.map(row => row.map(item => encodeURIComponent(item)).join(',')).join('\n');

//   // Format the CSV string
  const data = 'data:text/csv,' + csv;

  // Create a virtual Anchor tag
  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', 'export.csv');

  // Append the Anchor tag in the actual web page or application
  document.querySelector('.downloads').appendChild(link);

  // Trigger the click event of the Anchor link
  link.click();

  document.querySelector('.downloads').removeChild(link);
};

generateBtn.addEventListener('click', csvDownloadHandler);





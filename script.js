const API_URL = 'https://script.google.com/macros/s/AKfycbxAAmL1QPG1CvfwTiBPxYei1IbuVJhEbEdpvBqr85yO6V5nUmWokdGr8IKU7m2EK4u5/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Navigasi antar menu
  document.getElementById('menuInput').addEventListener('click', showInputForm);
  document.getElementById('menuView').addEventListener('click', showViewTable);
  document.getElementById('menuPengeluaran').addEventListener('click', showPengeluaranForm);
  document.getElementById('menuRekap').addEventListener('click', showRekap);
  document.querySelectorAll('.btnHome').forEach(btn => {
    btn.addEventListener('click', showHome);
  });

  // Form input pembayaran
  document.getElementById('formPembayaran').addEventListener('submit', submitPembayaran);
  document.getElementById('resetPembayaran').addEventListener('click', resetPembayaranForm);

  // Form input pengeluaran
  document.getElementById('formPengeluaran').addEventListener('submit', submitPengeluaran);

  // Inisialisasi
  showHome();
});

// Fungsi navigasi
function showHome() {
  hideAllSections();
  document.getElementById('homeMenu').style.display = 'block';
}

function showInputForm() {
  hideAllSections();
  document.getElementById('inputFormSection').style.display = 'block';
  loadSiswaOptions();
  setTodayDate('tanggalPembayaran');
}

function showViewTable() {
  hideAllSections();
  document.getElementById('viewTableSection').style.display = 'block';
  loadViewTable();
}

function showPengeluaranForm() {
  hideAllSections();
  document.getElementById('pengeluaranSection').style.display = 'block';
  setTodayDate('tanggalPengeluaran');
  loadPengeluaranTable();
}

function showRekap() {
  hideAllSections();
  document.getElementById('rekapSection').style.display = 'block';
  loadRekapData();
}

function hideAllSections() {
  document.querySelectorAll('.section').forEach(sec => {
    sec.style.display = 'none';
  });
}

// Fungsi utilitas
function setTodayDate(inputId) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById(inputId).value = today;
}

function loadSiswaOptions() {
  fetch(${API_URL}?action=getSiswa)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('namaSiswa');
      select.innerHTML = '';
      data.forEach(siswa => {
const option = document.createElement('option');
        option.value = siswa.NIS;
        option.textContent = siswa.Nama;
        select.appendChild(option);
      );
    );


// Fungsi input pembayaran
function submitPembayaran(e) 
  e.preventDefault();
  const tanggal = document.getElementById('tanggalPembayaran').value;
  const nis = document.getElementById('namaSiswa').value;
  const nama = document.getElementById('namaSiswa').selectedOptions[0].textContent;
  const jumlah = document.getElementById('jumlahPembayaran').value;

  fetch({API_URL}?action=addPembayaran, {
    method: 'POST',
    body: JSON.stringify({ Tanggal: tanggal, NIS: nis, Nama: nama, Jumlah: jumlah })
  })
    .then(res => res.json())
    .then(response => {
      alert('Pembayaran berhasil disimpan.');
      resetPembayaranForm();
    });
}

function resetPembayaranForm() {
  document.getElementById('formPembayaran').reset();
  setTodayDate('tanggalPembayaran');
}

// Fungsi tampilan tabel pembayaran
function loadViewTable() {
  fetch(API_URL?action=getSiswa)
    .then(res => res.json())
    .then(siswaData => 
      fetch({API_URL}?action=getPembayaran)
        .then(res => res.json())
        .then(pembayaranData => {
          const tbody = document.getElementById('viewTableBody');
tbody.innerHTML = '';
          siswaData.forEach((siswa, index) => {
            const totalBayar = pembayaranData
              .filter(p => p.NIS === siswa.NIS)
              .reduce((sum, p) => sum + Number(p['Jumlah Bayar']), 0);
            const sisa = Number(siswa['Jumlah Infaq']) - totalBayar;

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>index + 1</td>
              <td>{totalBayar}</td>
              <td>sisa</td>
              <td><button onclick="prefillPembayaran('{siswa.NIS}', 'siswa.Nama')">Bayar</button></td>
            `;
            tbody.appendChild(tr);
          );
        );
    );


function prefillPembayaran(nis, nama) 
  showInputForm();
  const select = document.getElementById('namaSiswa');
  select.value = nis;


// Fungsi input pengeluaran
function submitPengeluaran(e) 
  e.preventDefault();
  const tanggal = document.getElementById('tanggalPengeluaran').value;
  const jumlah = document.getElementById('jumlahPengeluaran').value;
  const penerima = document.getElementById('penerimaPengeluaran').value;

  fetch({API_URL}?action=addPengeluaran, {
    method: 'POST',
    body: JSON.stringify({ Tanggal: tanggal, Jumlah: jumlah, Penerima: penerima })
  })
    .then(res => res.json())
.then(response => {
      alert('Pengeluaran berhasil disimpan.');
      document.getElementById('formPengeluaran').reset();
      setTodayDate('tanggalPengeluaran');
      loadPengeluaranTable();
    });
}

// Fungsi tampilan tabel pengeluaran
function loadPengeluaranTable() {
  fetch(API_URL?action=getPengeluaran)
    .then(res => res.json())
    .then(data => 
      const tbody = document.getElementById('pengeluaranTableBody');
      tbody.innerHTML = ”;
      let total = 0;
      data.forEach((item, index) => 
        total += Number(item.Jumlah);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>{index + 1}</td>
          <td>item.Tanggal</td>
          <td>{item.Jumlah}</td>
          <td>item.Penerima</td>
        `;
        tbody.appendChild(tr);
      );
      const trTotal = document.createElement('tr');
      trTotal.innerHTML = `
        <td colspan="2"><strong>Total</strong></td>
        <td colspan="2"><strong>{total}</strong></td>
      `;
      tbody.appendChild(trTotal);
}

function loadRekapData() {
  fetch(`${API_URL}?action=getRekap`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('totalSeharusnya').textContent = data.totalSeharusnya;
      document.getElementById('totalDibayar').textContent = data.totalDibayar;
      document.getElementById('sisaBelumDibayar').textContent = data.sisaBelumDibayar;
      document.getElementById('totalPengeluaranRekap').textContent = data.totalPengeluaran;
      document.getElementById('saldo').textContent = data.saldo;
      document.getElementById('siswaLunas').textContent = data.siswaLunas;
      document.getElementById('siswaBelumLunas').textContent = data.siswaBelumLunas;
    });
}

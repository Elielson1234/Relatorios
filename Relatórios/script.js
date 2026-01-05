/* esses são os relatórios exemplos */
const savedReports = localStorage.getItem("reports");

const reports = savedReports
    ? JSON.parse(savedReports)
    : [
        { id: 5, tipo: "Venda mensal", categoria: "mensal", data: "24/08/2025 10:30", usuario: "Ana Maria" },
        { id: 4, tipo: "Atividades semanais", categoria: "semanal", data: "27/07/2025 10:00", usuario: "Lucas Silva" },
        { id: 3, tipo: "Financeiro anual", categoria: "anual", data: "01/07/2025 14:00", usuario: "Sara Ferreira" },
        { id: 2, tipo: "Tarefas pendentes", categoria: "semanal", data: "06/12/2025 18:00", usuario: "João Salvatore" },
        { id: 1, tipo: "Desempenho mensal", categoria: "mensal", data: "08/06/2025 21:00", usuario: "Maria Alice" }
    ];

let filteredReports = [...reports];

const table = document.getElementById("reportTable");
const count = document.querySelector(".count");


// 🔹 FUNÇÃO PARA SALVAR NO localStorage
function saveReports() {
    localStorage.setItem("reports", JSON.stringify(reports));
}

function renderTable(data) {
    table.innerHTML = "";

    data.forEach(report => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.tipo}</td>
            <td>${report.data}</td>
            <td>${report.usuario}</td>
            <td class="actions">
                <img src="imagem/olho.png" width="20" height="20" title="Visualizar"
                     onclick="viewReport(${report.id})">

                <img src="imagem/editar.png" width="20" height="20" title="Editar"
                     onclick="editReport(${report.id})">

                <img src="imagem/excluir.png" width="20" height="20" title="Excluir"
                     onclick="deleteReport(${report.id})">

                <img src="imagem/download.png" width="20" height="20" title="Baixar"
                     onclick="downloadReport(${report.id})">
            </td>
        `;

        table.appendChild(row);
    });

    count.textContent = `${data.length} relatórios encontrados`;
}

renderTable(filteredReports);

// 🔹 BUSCA
const searchInput = document.querySelector(".actions input");

searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase();

    filteredReports = reports.filter(report =>
        report.tipo.toLowerCase().includes(text) ||
        report.usuario.toLowerCase().includes(text)
    );

    renderTable(filteredReports);
});

// 🔹 FILTRO POR CATEGORIA
const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "all") {
            filteredReports = [...reports];
        } else {
            filteredReports = reports.filter(report =>
                report.categoria === category
            );
        }

        renderTable(filteredReports);
    });
});

// 🔹 AÇÕES
function viewReport(id) {
    const report = reports.find(r => r.id === id);

    if (!report?.fileUrl) {
        alert("Nenhum arquivo anexado.");
        return;
    }

    window.open(report.fileUrl, "_blank");
}

function editReport(id) {
    const report = reports.find(r => r.id === id);

    if (!report) {
        alert("Relatório não encontrado.");
        return;
    }

    const novoUsuario = prompt(
        "Editar usuário responsável:",
        report.usuario
    );

    if (!novoUsuario) return;

    report.usuario = novoUsuario;

    saveReports();              // salva no localStorage
    filteredReports = [...reports];
    renderTable(filteredReports);
}




function deleteReport(id) {
    const confirmDelete = confirm("Deseja excluir o relatório " + id + "?");

    if (confirmDelete) {
        const index = reports.findIndex(r => r.id === id);
        reports.splice(index, 1);

        saveReports(); // 👈 salva após excluir

        filteredReports = [...reports];
        renderTable(filteredReports);
    }
}

function downloadReport(id) {
    const report = reports.find(r => r.id === id);

    if (!report?.fileUrl) {
        alert("Arquivo não disponível.");
        return;
    }

    const a = document.createElement("a");
    a.href = report.fileUrl;
    a.download = report.fileName;
    a.click();
}


// 🔹 NOVO RELATÓRIO
const newReportBtn = document.querySelector(".actions button");

let tempTipo = "";
let tempUsuario = "";

function addNewReport() {
    tempTipo = prompt("Tipo do relatório:");
    if (!tempTipo) return;

    tempUsuario = prompt("Usuário responsável:");
    if (!tempUsuario) return;

    openModal();
}

function openModal() {
    document.getElementById("categoryModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("categoryModal").style.display = "none";
}

function selectCategory(categoria) {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Anexe um documento (PDF, Word ou Excel).");
        return;
    }

    const now = new Date();

    // cria URL temporária do arquivo
    const fileUrl = URL.createObjectURL(file);

    const newReport = {
        id: reports.length ? reports[0].id + 1 : 1,
        tipo: tempTipo,
        categoria,
        data:
            now.toLocaleDateString() + " " +
            now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usuario: tempUsuario,
        fileName: file.name,
        fileType: file.type,
        fileUrl
    };

    reports.unshift(newReport);
    saveReports();
    filteredReports = [...reports];
    renderTable(filteredReports);

    fileInput.value = "";
    closeModal();
}

newReportBtn.addEventListener("click", addNewReport);

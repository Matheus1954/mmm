document.addEventListener("DOMContentLoaded", function () {
    // --- Sidebar e navbar ---
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId);

        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener("click", () => {
                nav.classList.toggle("show");
                toggle.classList.toggle("bx-x");
                bodypd.classList.toggle("body-pd");
                headerpd.classList.toggle("body-pd");
            });
        }
    };

    showNavbar("header-toggle", "nav-bar", "body-pd", "header");

    const linkColor = document.querySelectorAll(".nav_link");

    function colorLink() {
        linkColor.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
    }
    linkColor.forEach((l) => l.addEventListener("click", colorLink));

    // --- Eventos do calendário ---
    const botoesAdd = document.querySelectorAll(".add");
    const modal = document.querySelector(".modal");
    const inputTitulo = document.getElementById("titulo-evento");
    const selectCor = document.getElementById("cor-evento");

    let diaSelecionado = null;
    const historico = [];

    botoesAdd.forEach((botao) => {
        botao.addEventListener("click", function (e) {
            diaSelecionado = e.target.closest(".dia");
            inputTitulo.value = "";
            selectCor.value = "prova";
            modal.style.display = "flex";
        });
    });

    window.fecharModal = function () {
        modal.style.display = "none";
    };

    window.salvarEvento = function () {
        if (!diaSelecionado) return;

        const titulo = inputTitulo.value.trim();
        const cor = selectCor.value;

        if (titulo === "") {
            alert("Digite um título para o evento.");
            return;
        }

        // Remove qualquer evento anterior no dia
        diaSelecionado.querySelectorAll(".evento").forEach(e => e.remove());

        const divEvento = document.createElement("div");
        divEvento.classList.add("evento", cor);
        divEvento.textContent = titulo;
        diaSelecionado.appendChild(divEvento);

        const indexDia = Array.from(document.querySelectorAll(".dia")).indexOf(diaSelecionado);
        historico.push({ dia: indexDia, titulo, cor });

        salvarEventosLocalStorage();
        modal.style.display = "none";
    };

    window.desfazerUltimaAcao = function () {
        if (historico.length === 0) {
            alert("Nada para desfazer.");
            return;
        }

        const ultima = historico.pop();
        const dias = document.querySelectorAll(".dia");
        const dia = dias[ultima.dia];

        const eventos = dia.querySelectorAll(".evento");
        for (let i = eventos.length - 1; i >= 0; i--) {
            if (eventos[i].textContent === ultima.titulo && eventos[i].classList.contains(ultima.cor)) {
                dia.removeChild(eventos[i]);
                break;
            }
        }

        salvarEventosLocalStorage();
    };

    function salvarEventosLocalStorage() {
        const dias = document.querySelectorAll(".dia");
        const eventos = [];

        dias.forEach((dia, index) => {
            dia.querySelectorAll(".evento").forEach((evento) => {
                eventos.push({
                    dia: index,
                    titulo: evento.textContent,
                    cor: evento.classList[1] || "default"
                });
            });
        });

        localStorage.setItem("eventosCalendario", JSON.stringify(eventos));
    }

    function carregarEventosLocalStorage() {
        const eventos = JSON.parse(localStorage.getItem("eventosCalendario") || "[]");
        const dias = document.querySelectorAll(".dia");

        eventos.forEach((evento) => {
            if (dias[evento.dia]) {
                const divEvento = document.createElement("div");
                divEvento.classList.add("evento", evento.cor);
                divEvento.textContent = evento.titulo;
                dias[evento.dia].appendChild(divEvento);
            }
        });
    }

    carregarEventosLocalStorage();

    // --- Botão resetar calendário ---
    document.getElementById('resetCalendarBtn').addEventListener('click', () => {
        if (confirm("Tem certeza que deseja resetar o calendário? Isso apagará todos os eventos.")) {
            // Limpa os eventos salvos
            localStorage.removeItem('eventosCalendario');

            // Cria eventos padrão
            const dias = document.querySelectorAll(".dia");
            const eventos = [];

            dias.forEach((dia, index) => {
                dia.innerHTML = '<i class="bx bx-plus add"></i>'; // Limpa visual
                eventos.push({
                    dia: index,
                    titulo: `Evento do Dia ${index + 1}`,
                    cor: "prova"
                });
            });

            localStorage.setItem("eventosCalendario", JSON.stringify(eventos));

            carregarEventosLocalStorage();
        }
    });
});

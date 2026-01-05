(async function () {
  if (!window.supabaseClient) {
    console.warn("Supabase client não encontrado. Adapter abortado.");
    return;
  }

  const STORAGE_PREFIX = ""; // vamos salvar tudo
  const TABLE = "treinos";

  async function salvarTudoNoSupabase() {
    try {
      const { data: userData } = await window.supabaseClient.auth.getUser();
      if (!userData.user) return;

      const snapshot = {};

const MAIN_KEY = "treino330";

if (localStorage.getItem(MAIN_KEY)) {
  snapshot[MAIN_KEY] = localStorage.getItem(MAIN_KEY);
}


      await window.supabaseClient
        .from(TABLE)
        .upsert({
          user_id: userData.user.id,
          payload: JSON.stringify(snapshot),
          updated_at: new Date().toISOString()
        });
    } catch (e) {
      console.error("Erro ao salvar no Supabase:", e);
    }
  }

  async function restaurarTudoDoSupabase() {
    try {
      const { data: userData } = await window.supabaseClient.auth.getUser();
      if (!userData.user) return;

      const { data } = await window.supabaseClient
  .from(TABLE)
  .select("payload")
  .eq("user_id", userData.user.id)
  .order("updated_at", { ascending: false })
  .limit(1);

if (!data || data.length === 0) return;

const snapshot = JSON.parse(data[0].payload);
Object.keys(snapshot).forEach(key => {
  localStorage.setItem(key, snapshot[key]);
});


      if (data && data.payload) {
        const snapshot = JSON.parse(data.payload);
        Object.keys(snapshot).forEach(key => {
          localStorage.setItem(key, snapshot[key]);
        });
        console.log("LocalStorage restaurado do Supabase");
      }
    } catch (e) {
      console.warn("Nenhum dado anterior para restaurar");
    }
  }

  // restaura ao abrir
window.supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    restaurarTudoDoSupabase();
  }
});


  // salva ao sair / recarregar
  window.addEventListener("beforeunload", salvarTudoNoSupabase);

window.salvarTreinoAgora = function () {
  salvarTudoNoSupabase();
};
document.addEventListener("click", (e) => {
  const el = e.target;
  if (el.tagName === "BUTTON" && el.innerText.toLowerCase().includes("salvar")) {
    window.salvarTreinoAgora();
  }
});

})();

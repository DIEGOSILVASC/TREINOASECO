// ================================
// SUPABASE ADAPTER – TREINO 330
// ================================

(async function () {
  // Aguarda Supabase estar disponível
  if (!window.supabaseClient) {
    console.error("Supabase client não encontrado");
    return;
  }

  // ================================
  // 1️⃣ OBTÉM USUÁRIO LOGADO
  // ================================
  const { data: authData, error: authError } =
    await window.supabaseClient.auth.getUser();

  if (authError || !authData.user) {
    console.warn("Usuário não autenticado");
    return;
  }

  const user = authData.user;

  // ================================
  // 2️⃣ LOAD – BUSCA ÚNICO REGISTRO
  // ================================
  async function loadFromSupabase() {
    const { data, error } = await window.supabaseClient
      .from("treinos")
      .select("payload")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Não é erro se ainda não existir registro
      console.info("Nenhum payload salvo ainda");
      return;
    }

    if (data && data.payload) {
      try {
        const payload =
          typeof data.payload === "string"
            ? JSON.parse(data.payload)
            : data.payload;

        // Salva no localStorage
        localStorage.setItem("treino330", JSON.stringify(payload));
        console.info("Payload restaurado do Supabase");
      } catch (e) {
        console.error("Erro ao parsear payload:", e);
      }
    }
  }

  // ================================
  // 3️⃣ SAVE – UPSERT (SEM DUPLICAR)
  // ================================
  async function saveToSupabase(payload) {
    const { error } = await window.supabaseClient
      .from("treinos")
      .upsert(
        {
          user_id: user.id,
          payload: payload,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
    } else {
      console.info("Progresso salvo no Supabase");
    }
  }

  // ================================
  // 4️⃣ HOOK NO BOTÃO "SALVAR"
  // ================================
  const originalSetItem = localStorage.setItem;

  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);

    if (key === "treino330") {
      try {
        const payload = JSON.parse(value);
        saveToSupabase(payload);
      } catch (e) {
        console.error("Payload inválido:", e);
      }
    }
  };

  // ================================
  // 5️⃣ EXECUTA LOAD AO INICIAR
  // ================================
  await loadFromSupabase();
})();

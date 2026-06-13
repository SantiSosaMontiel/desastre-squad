// Netlify Function: proxy a la API oficial de AoE2 (Relic / WorldsEdge).
// Devuelve el ELO de 1v1 Random Map de un jugador, evitando el problema de CORS
// que impide consultar la API directamente desde el navegador.

const RM_1V1_LEADERBOARD_ID = 3; // Random Map 1v1

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const profileId = event.queryStringParameters && event.queryStringParameters.profile_id;
  if (!profileId || !/^\d+$/.test(profileId)) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'profile_id invalido' }) };
  }

  const url = `https://aoe-api.worldsedgelink.com/community/leaderboard/getpersonalstat?title=age2&profile_ids=[${profileId}]`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: `upstream ${res.status}` }) };
    }
    const data = await res.json();
    const stats = (data && data.leaderboardStats) || [];
    const rm = stats.find((s) => s.leaderboard_id === RM_1V1_LEADERBOARD_ID);
    const rating = rm && typeof rm.rating === 'number' ? rm.rating : null;
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ profile_id: Number(profileId), rating }) };
  } catch (err) {
    return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};

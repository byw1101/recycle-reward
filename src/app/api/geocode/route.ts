import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: '주소를 입력해주세요.' }, { status: 400 });
  }

  try {
    // 1차 검색: 전체 입력 주소로 검색
    let res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=kr&limit=1`,
      {
        headers: {
          'User-Agent': 'RecycleRewardApp/1.0 (contact: admin@recyclereward.local)'
        }
      }
    );
    let data = await res.json();

    if (data && data.length > 0) {
      return NextResponse.json({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      });
    }

    // 2차 검색: 상세 번지수가 너무 세밀해서 안 나올 경우 시/구/동 또는 도로명 단위로 완화 검색
    const tokens = query.trim().split(/\s+/);
    if (tokens.length >= 2) {
      // 앞의 3개 단어(예: 천안시 동남구 신부동)로 검색 시도
      const broaderQuery = tokens.slice(0, Math.min(tokens.length, 3)).join(' ');
      res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(broaderQuery)}&countrycodes=kr&limit=1`,
        {
          headers: {
            'User-Agent': 'RecycleRewardApp/1.0 (contact: admin@recyclereward.local)'
          }
        }
      );
      data = await res.json();

      if (data && data.length > 0) {
        return NextResponse.json({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name
        });
      }
    }

    // 천안시 기본 좌표 (검색 실패 시 안전 기본값 fallback)
    return NextResponse.json({
      lat: 36.8151,
      lng: 127.1139,
      isFallback: true,
      message: '정밀 좌표를 찾지 못하여 천안시 중심 좌표로 설정되었습니다.'
    });
  } catch (err: any) {
    return NextResponse.json({
      lat: 36.8151,
      lng: 127.1139,
      isFallback: true,
      error: err.message
    });
  }
}

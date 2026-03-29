import type { Article } from '../types/article'

export const articles: Article[] = [
  {
    id: 'article-1',
    slug: 'poradnik-kupujacego',
    title: 'Poradnik kupującego',
    lead: 'Wszystko, co musisz wiedzieć przed zakupem nieruchomości.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    content: [
      'Zakup nieruchomości to jedna z najważniejszych decyzji finansowych w życiu. Warto się do niej odpowiednio przygotować, aby uniknąć kosztownych błędów.',
      'Pierwszym krokiem jest określenie budżetu. Sprawdź swoją zdolność kredytową w kilku bankach — oferty mogą się znacząco różnić. Pamiętaj o dodatkowych kosztach: podatek PCC (2%), notariusz, prowizja pośrednika, ewentualny remont.',
      'Wybierając lokalizację, zwróć uwagę nie tylko na cenę metra kwadratowego, ale też na infrastrukturę: szkoły, sklepy, komunikację miejską, tereny zielone. Sprawdź plan zagospodarowania przestrzennego — może się okazać, że obok planowana jest autostrada.',
      'Podczas oglądania mieszkania sprawdź stan instalacji (elektrycznej, wodnej, gazowej), okna, ściany pod kątem wilgoci i pęknięć. Nie bój się pytać o rachunki za media i czynsz administracyjny.',
      'Przed podpisaniem umowy przedwstępnej koniecznie sprawdź księgę wieczystą nieruchomości. Upewnij się, że sprzedający jest faktycznym właścicielem i że nieruchomość nie jest obciążona hipoteką lub służebnością.',
    ],
  },
  {
    id: 'article-2',
    slug: 'poradnik-sprzedajacego',
    title: 'Poradnik sprzedającego',
    lead: 'Jak skutecznie sprzedać nieruchomość i uzyskać najlepszą cenę.',
    imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop',
    content: [
      'Sprzedaż nieruchomości wymaga odpowiedniego przygotowania. Pierwsze wrażenie ma ogromne znaczenie — zadbaj o porządek, drobne naprawy i estetykę mieszkania przed zdjęciami i wizytami.',
      'Właściwa wycena to klucz do sukcesu. Zbyt wysoka cena odstraszy kupujących, zbyt niska oznacza stratę pieniędzy. Porównaj ceny podobnych nieruchomości w okolicy lub skorzystaj z usług rzeczoznawcy.',
      'Profesjonalne zdjęcia potrafią znacząco przyspieszyć sprzedaż. Fotografuj w dzień, przy naturalnym świetle. Pokaż wszystkie pomieszczenia, widok z okna i otoczenie budynku.',
      'Przygotuj komplet dokumentów: akt notarialny, zaświadczenie o niezaleganiu z opłatami, świadectwo energetyczne. Kupujący doceni sprawną obsługę formalności.',
    ],
  },
  {
    id: 'article-3',
    slug: 'rynek-nieruchomosci-2026',
    title: 'Rynek nieruchomości 2026',
    lead: 'Prognozy i trendy na rynku nieruchomości w Polsce.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600&h=400&fit=crop',
    content: [
      'Rok 2026 przynosi stabilizację cen na rynku nieruchomości w największych miastach Polski. Po dynamicznych wzrostach z lat poprzednich, rynek wchodzi w fazę wyrównania.',
      'Największy popyt utrzymuje się w Warszawie, Krakowie i Trójmieście. Coraz większym zainteresowaniem cieszą się jednak miasta średniej wielkości — Rzeszów, Lublin czy Białystok — gdzie relacja cen do zarobków jest korzystniejsza.',
      'Segment wynajmu pozostaje silny, napędzany przez studentów, młodych profesjonalistów i pracowników zdalnych szukających elastyczności. Stawki najmu stabilizują się po wzrostach z 2024-2025.',
      'Rynek deweloperski koncentruje się na mniejszych, funkcjonalnych metrażach (30-55 m²) i inwestycjach z rozwiniętą infrastrukturą osiedlową. Rośnie znaczenie certyfikatów energetycznych i rozwiązań ekologicznych.',
    ],
  },
  {
    id: 'article-4',
    slug: 'jak-przygotowac-mieszkanie-do-sprzedazy',
    title: 'Jak przygotować mieszkanie do sprzedaży',
    lead: 'Praktyczne wskazówki, które pomogą szybciej znaleźć kupca.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
    content: [
      'Home staging, czyli profesjonalne przygotowanie nieruchomości do sprzedaży, może skrócić czas transakcji nawet o połowę. Nie wymaga dużych nakładów — często wystarczą drobne zmiany.',
      'Zacznij od odgracenia. Usuń nadmiar mebli, osobiste zdjęcia i bibeloty. Kupujący musi być w stanie wyobrazić sobie siebie w tym mieszkaniu, a nie oglądać Twoje pamiątki z wakacji.',
      'Pomaluj ściany na jasne, neutralne kolory — biel, jasny szary, ecru. Wymień przepalone żarówki, napraw cieknące krany, dokręć klamki. Te drobnostki składają się na ogólne wrażenie zadbania.',
      'Zadbaj o zapach — wywietrz mieszkanie, unikaj intensywnych odświeżaczy powietrza. Świeżo zaparzona kawa lub domowe ciasto przed wizytą to klasyczny, ale skuteczny trik.',
      'Nie zapomnij o klatce schodowej i otoczeniu budynku — to pierwsze, co widzi potencjalny kupujący. Jeśli jest taka możliwość, zadbaj o porządek na korytarzu.',
    ],
  },
]

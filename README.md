# PM Vue GraphQL

> Wersja 0.2.0

### Prototyp aplikacji wykorzystującej technologie Vue.js i GraphQL

Obejmuje środowisko z graficznym edytorem pozwalającym na utworzenie i skonfigurowanie własnej aplikacji internetowej
z wykorzystaniem gotowych komponentów, mechanizm ustalania motywu wizualnego, narzędzie definiowania
akcji wykonywanych przez komponenty z wykorzystaniem zdefiniowanego źródła danych, bez potrzeby ręcznego
pisania zapytań w języku SQL czy GraphQL oraz modułem wykonawczym odpowiedzialnym za realizację zadania minimalizacji
kodu i będącym jednocześnie środowiskiem działania aplikacji.

## Założenia prototypu

Wykorzystanie Vue, biblioteki Vuetify oraz języka GraphQL w systemach budowy aplikacji minimalizujących ilość
kodu i automatyzujących tworzenie interfejsów użytkownika.

1. Analiza zagadnienia tworzenia aplikacji przy pomocy platform budowy aplikacji low-code.
2. Przegląd i analiza istniejących rozwiązań, określenie cech jakimi powinna charakteryzować się platforma budowy
   aplikacji low-code.
3. Koncepcja własnego rozwiązania wykorzystującego Vue oraz język GraphQL.
4. Projekt i implementacja prototypu rozwiązania obejmującego IDE z graficznym edytorem pozwalającym na tworzenie
   wyglądu aplikacji webowej z wykorzystaniem gotowych komponentów, mechanizmem ustalania tematu wizualnego,
   mechanizmem definiowania akcji wykonywanych przez komponenty z wykorzystaniem backendowej bazy danych,
   bez potrzeby tworzenia zapytań.
5. Projekt i implementacja biblioteki obsługującej zadanie minimalizacji kodu poprzez generowanie gotowego
   kodu aplikacji, zgodnie z wzorcami frameworku Vue i wykorzystując język GraphQL, na podstawie projektu użytkownika.

## Struktura projektu

1. `config/` - Pakiet zawierający zrzuty schematów baz danych wykorzystywanych do obsługi platformy oraz zrzuty
   przykładowej konfiguracji aplikacji użytkownika
2. `src/assets/` - Style css wykorzystywane przez platformę
3. `src/components/` - Komponenty powszechnie wykorzystywane w aplikacji
    1. `widget/` - Komponenty generowane na widoku wynikowym aplikacji w środowisku uruchomieniowym
4. `src/graphql/` - Konfiguracja GraphQL, biblioteka zapytań obsługi platformy
    1. `queries/datasource.ts` - Zapytania obsługi definicji źródła danych wprowadzanych przez użytkownika
    2. `queries/mutation.ts` - Zapytania obsługi definicji mutacji GraphQL zdefiniowanych przez użytkownika
    3. `queries/page.ts` - Zapytania obsługi definicji stron zdefiniowanych przez użytkownika
    4. `queries/project.ts` - Zapytania obsługi definicji projektu aplikacji użytkownika
    5. `queries/prop.ts` - Zapytania obsługi zmiennych strony tworzonej przez użytkownika
    6. `queries/query.ts` - Zapytania obsługi definicji zapytań GraphQL zdefiniowanych przez użytkownika
    7. `queries/schema.ts` - Zapytanie pobierające schemat bazy danych użytkownika
    8. `queries/theme.ts` - Zapytania obsługujące definicję kolorystyki aplikacji
    9. `queries/user.ts` - Zapytania dotyczące obecnie zalogowanego użytkownika
5. `src/i18n/` - Tłumaczenia części administratorskiej systemu
6. `src/lib/` - Biblioteka skryptów wykorzystywanych podczas zadań generowania kodu aplikacji
7. `views/main` - Komponenty tworzące panel administratora do zarządzania projektami, motywami oraz źródłami danych
8. `views/editor` - Komponenty tworzące edytor aplikacji wraz z zakładkami
9. `views/runtime` - Komponenty odpowiedzialne za generowanie i wyświetlanie interfejsu aplikacji użytkownika

![Alt text](readme/img/structure/structure.png?raw=true "Project Structure")

## Biblioteki generowania kodu

> `src/lib/filters.ts` - Zawiera funkcje filtrujące dla pól wprowadzania, dla generowanej strony.

> `src/lib/graphql_gen.ts` - Zawiera funkcje obejmujące generowanie poszczególnych części zapytań i mutacji,
> jak i całości zapytań w wersjach poglądowych oraz wykonywalnych w języku GraphQL. Zawiera także funkcje
> uruchamiające zapytania i mutacje na zadanym endpoincie GraphQL. Sposób przechowywania części zapytań i mutacji
> przedstawia poniższa tabela.

| Tabela   | Pole           | Zawartość pola                                                                                                                                                                                                                                                                |
|----------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| QUERY    | name           | Nazwa zapytania                                                                                                                                                                                                                                                               |
| QUERY    | limit          | Limit pobieranych danych w postaci liczbowej (jeżeli puste pobieraj wszystkie dane)                                                                                                                                                                                           |
| QUERY    | order_by       | Sortowanie tabeli w formacie {"field": `Nazwa pola`, "isAsc": `Sortuj rosnąco`}                                                                                                                                                                                               |
| QUERY    | where          | Warunek ograniczający dane w formacie {"field": `Nazwa pola`, "operator": `Operator logiczny`, "variable": `Zmienna zapytania`, "isAnd": `Czy warunek łączący to and?`: "required": `Czy pole jest wymagane, jeśli nie ma przypisanej wartości`}                              |
| QUERY    | fields         | Lista pól wynikowych zapytania w formie tekstowej oddzielona znakiem `;`                                                                                                                                                                                                      |
| QUERY    | data_source_id | Identyfikator źródła danych                                                                                                                                                                                                                                                   |
| QUERY    | table          | Nazwa tabeli, na której ma być uruchomione zapytanie                                                                                                                                                                                                                          |
| QUERY    | modify_date    | Data modyfikacji zapytania                                                                                                                                                                                                                                                    |
| QUERY    | id             | Identyfikator zapytania                                                                                                                                                                                                                                                       |
| QUERY    | variables      | Zmienne zapytania w formacie {"name": `Nazwa zmiennej`, "type": `Typ danych zmiennej`, "value": `Wartość stała zmiennej`}                                                                                                                                                     |
| MUTATION | name           | Nazwa mutacji                                                                                                                                                                                                                                                                 |
| MUTATION | type           | Rodzaj mutacji (Create, Update, Delete)                                                                                                                                                                                                                                       |
| MUTATION | where          | Warunek wyznaczające dane do aktualizacji lub usunięcia w formacie {"field": `Nazwa pola`, "operator": `Operator logiczny`, "variable": `Zmienna zapytania`, "isAnd": `Czy warunek łączący to and?`: "required": `Czy pole jest wymagane, jeśli nie ma przypisanej wartości`} |
| MUTATION | fields         | Lista pól aktualizowanych podczas tworzenia lub aktualizacji w formie tekstowej oddzielona znakiem `;`                                                                                                                                                                        |
| MUTATION | data_source_id | Identyfikator źródła danych                                                                                                                                                                                                                                                   |
| MUTATION | table          | Nazwa tabeli, na której ma być uruchomiona mutacja                                                                                                                                                                                                                            |
| MUTATION | modify_date    | Data modyfikacji mutacji                                                                                                                                                                                                                                                      |
| MUTATION | id             | Identyfikator mutacji                                                                                                                                                                                                                                                         |
| MUTATION | variables      | Zmienne mutacji w formacie {"name": `Nazwa zmiennej`, "type": `Typ danych zmiennej`, "value": `Wartość stała zmiennej`}                                                                                                                                                       |

> `src/lib/schema.ts` - Zawiera skrypty odpowiedzialne za pobieranie i przygotowanie schematu źródła danych pobranego
> z endpoint GraphQL. Skrypty obejmują pobieranie całego schematu danych, jak i szczegółów poszczególnych pól.

> `src/lib/types.ts` - Zawiera zbiór typów danych wykorzystywanych przez platformę.

> `src/lib/widget.ts` - Zawiera skrypty związane z obsługą generowanych komponentów stron użytkownika. Obsługuje
> odczyt wartości konfiguracyjnych komponentów - w postaci właściwości css, argumentów konfiguracyjnych oraz mapowania
> danych. Generuje także warunki ograniczające widoczność komponentów i akcje uruchamiane przez komponenty. Definicja
> każdego z komponentów strony jest przechowywana w postaci pliku w formacie JSON w tabeli PAGE.

> `src/lib/widgets.json` - Zawiera definicję wszystkich komponentów graficznych platformy, wraz z definicja dostępnych
> właściwości dla każdego komponentu.

## Instalacja

Przed uruchomieniem platformy wymagana jest konfiguracja bazy danych dla administratora systemu. Skrypty generujące
dla bazy danych administratora znajdują się w folderze `config/admindb`. Skonfigurowana baza danych musi następnie
zostać udostępniona platformie w postaci endpointu GraphQL (rekomendowana jest platforma Hasura).

Po skonfigurowaniu endpointu GraphQL, właściwości platformy mogą zostać dostosowane poprzez zmianę wartości zmiennych
w pliku `.env`. Opcje konfiguracyjne obejmują:

| Nazwa zmiennej                        | Wartość                                                                                                   |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------|
| VUE_APP_NAME                          | Nazwa aplikacji                                                                                           |
| VUE_APP_GRAPHQL_ENDPOINT_URL          | Endpoint GraphQL dla źródła danych administratora                                                         |
| VUE_APP_GRAPHQL_ENDPOINT_SECRET       | Sekret wykorzystywany do uwierzytelnienia dla endpointu GraphQL (opcjonalna)                              |
| VUE_APP_DATA_SOURCE_SECRET_CRYPTO_KEY | Klucz szyfrowania haseł podawanych przez użytkownika do uwierzytelnienia do endpointu GraphQL użytkownika |
| VUE_APP_AUTH0_DOMAIN                  | Adres domeny auth0, wykorzystywanej podczas logowania do systemu przez administratora                     |
| VUE_APP_AUTH0_CLIENTID                | Id klienta auth0, wykorzystywanego podczas logowania do systemu przez administratora                      |                  

## Aplikacje przykładowe

Folder `config/userdb/` zawiera skrypty generowania bazy danych użytkownika, wykorzystywanej w demonstracyjnych
projektach aplikacji. Dane wykorzystane podczas projektowania przykładowych aplikacji zostały umieszczone w plikach
`config/admindb/data_import.sql` i `config/userdb/data_import.sql`, w formie poleceń INSERT języka SQL. Polecenia te
uzupełniają dane w bazie danych administratora o konfigurację motywów, źródła danych oraz projektów oraz bazę danych
użytkownika o rekordy prezentowane na wygenerowanych stronach aplikacji.

Folder `config/pages/` zawiera wyeksportowane definicje stron w formacie JSON, projektów przykładowych. Pliki te są
możliwe do zaimportowania w projektach przykładowych aplikacji.

Zestaw powyższych danych zawiera definicję dwóch aplikacji:

1. Aplikacji rezerwacji wizyt lekarskich - obejmuje widok startowy, listę placówek, listę lekarzy, terminarz dostępnych
   wizyt, formularz rezerwacji terminu wizyty, stronę potwierdzenia rezerwacji oraz stronę zawierającą warunki
   korzystania z serwisu.
   ![Alt text](readme/img/example/example_1.png?raw=true "Example 1")

2. Aplikacji administratorskiej dla aplikacji 1 - obejmuje widoki dodawania i modyfikacji danych wykorzystywanych
   przez aplikację 1.
   ![Alt text](readme/img/example/example_2.png?raw=true "Example 2")

## Użytkowanie

### Panel startowy

Logowanie do aplikacji oraz rejestracja użytkownika przebiegają przy pomocy auth0.

![Alt text](readme/img/dashboard/login.png?raw=true "Login")

Panel startowy zawiera zakładki Aplikacji, Motywów, Źródeł danych oraz skróty do edytorów dla utworzonych aplikacji.
Każda z zakładek pozwala na edycję, usunięcie lub dodanie nowej definicji.

![Alt text](readme/img/dashboard/start.png?raw=true "Start")

### Motyw

![Alt text](readme/img/theme/theme.png?raw=true "Theme")

Konfigurator motywu pozwala na wybranie zestawu 9 kolorów podstawowych aplikacji. Wybrane kolory zapisywane są w
tabeli THEME. Podgląd kolorystyki odświeżany jest na żywo po zmianie każdego z kolorów. Kolory dostosowywane są
za pomocą komponentu Vuetify: https://vuetifyjs.com/en/components/color-pickers/.

### Źródło danych

![Alt text](readme/img/datasource/datasource.png?raw=true "Datasource")

Konfigurator źródła danych przyjmuje dane połączenie endpointu GraphQL - adres oraz sekret. Po wprowadzeniu danych
możliwe jest sprawdzenie połączenia z endpointem, w przypadku błędu wyświetlany jest komunikat błędu GraphQL. Po prawej
stronie wyświetlany jest schemat bazy danych. Wyświetlane są wszystkie tabele wraz z ich polami, typami pól i
wymagalnością. Wybrane źródło danych i dane połączenia zapisywane są w tabeli DATA_SOURCE.

### Projekt

![Alt text](readme/img/project/project.png?raw=true "Project")

Konfigurator projektu pozwala na zdefiniowanie nazwy projektu, opisu, motywu oraz źródła danych.
Formularz wyświetla uproszczone wyglądy edytora motywu i źródła danych. Po wybraniu motywu lub źródła danych
wyświetlane są informacje podglądowe ułatwiające wybór. Każdy projekt aplikacji może posiadać wyłącznie jeden motyw i
jedno źródło danych. Definicja projektu zapisywana jest w tabeli PROJECT.

### Edytor aplikacji

Edytor aplikacji składa się 5 zakładek, dzielących funkcjonalności obejmujące opcje dostrajania wyglądu oraz działania
aplikacji.

![Alt text](readme/img/appeditor/settings.png?raw=true "Settings")

Pierwsza zakładka odpowiada za ustawianie opcji ogólnych aplikacji, takich jak uruchomienie aplikacji, wyznaczenie
strony startowej aplikacji oraz ustawień górnego paska nawigacji. Strona startowa oraz nawigacja górna są możliwe do
skonfigurowania po utworzeniu przynajmniej jednej strony aplikacji.

![Alt text](readme/img/appeditor/pages.png?raw=true "Pages")

Zakładka stron wyświetla listę utworzonych stron aplikacji w postaci nazwy, identyfikatora oraz daty ostatniej
modyfikacji strony. Każda ze stron może zostać otwarta w edytorze aplikacji lub usunięta.

![Alt text](readme/img/appeditor/tables.png?raw=true "Tables")

Zakładka tabel wyświetla podgląd schematu bazy danych podobnie jak na ekranie konfiguracji źródła danych.

![Alt text](readme/img/appeditor/queries.png?raw=true "Queries")

Zakładka zapytań, wyświetla zestaw wszystkich zapytań utworzonych dla wybranego źródła danych. Zapytania są
współdzielone przez wszystkie aplikacje w celu ograniczenia nadmiarowości tworzonych zapytań. Wyświetlane są
nazwa zapytania, data modyfikacji oraz opcje otwarcia edytora zapytania lub usunięcia zapytania.

![Alt text](readme/img/appeditor/mutations.png?raw=true "Mutations")

Zakładka mutacji, wyświetla zestaw wszystkich mutacji, czyli operacji zmiany danych utworzonych dla wybranego
źródła danych. Mutacje są współdzielone przez wszystkie aplikacje w celu ograniczenia nadmiarowości tworzonych
konfiguracji. Wyświetlane są nazwa mutacji, rodzaj operacji, data modyfikacji oraz udostępnione są opcje otwarcia
edytora mutacji lub usunięcia mutacji.

### Edytor zapytań

Edytor zapytań jest podzielony na zestaw formularzy pozwalających na dostosowanie poszczególnych składowych
zapytania. Sposób tworzenia zapytania opisany został w sekcji 'Biblioteki generowania kodu'.

![Alt text](readme/img/query/query_details.png?raw=true "Query Details")

Formularz "Zapytanie" pozwala na ustawienie podstawowych informacji o zapytaniu, w tym jego nazwę, tabele oraz limit
zwracanych wierszy zapytania.

![Alt text](readme/img/query/query_fields.png?raw=true "Query Fields")

Formularz "Pola" pozwala na wybranie listy pól zwracanych jako wynik zapytania GraphQL. Pola wybierane są z tabeli po
kliknięciu wybranego pola. Obecna jest także opcja wyboru wszystkich lub żadnego pola. Pola ograniczone są jedynie
do pól samej tabeli i pól relacji obiektowych (jeden-do-jeden). Relacje tabelaryczne obsługiwane są przy pomocy
komponentu kolumny.

![Alt text](readme/img/query/query_sort.png?raw=true "Query Sort")

Formularz "Sortowanie" pozwala na wybranie pól tabeli po których posortowany zostanie zestaw wynikowy zapytania.
Dostępne opcje sortowania, to sortowanie rosnące i malejące dla każdego pola.

![Alt text](readme/img/query/query_vars.png?raw=true "Query Vars")

Formularz "Zmienne" pozwala na zdefiniowanie zmiennych wykorzystywanych przez zapytanie. Formularz pozwala na
zdefiniowanie pola przy pomocy nazwy zmiennej, rodzaju zmiennej oraz przypisanej wartości stałej. Wartość stała
wykorzystywana jest podczas testowania zapytania oraz jako wartość domyślna zmiennej podczas uruchamiania zapytania
z poziomu wygenerowanej strony.

![Alt text](readme/img/query/query_where.png?raw=true "Query Where")

Formularz "Warunki" pozwala na zdefiniowanie ograniczeń zapytania. Możliwe jest utworzenie dowolnej liczby
warunków łączonych przy pomocy operatorów "and" i "or". Kolejność wprowadzanych warunków wpływa na sposób ich łączenia
przy pomocy operatorów. Definicja pojedynczego warunku pozwala na wybranie pola tabeli, operatora sprawdzającego
warunek, zmiennej, która zostanie wstawiona podczas wywołania zapytania. Możliwa jest także opcja zaznaczenia pola
jako wymagane lub opcjonalne. Odznaczenie opcji "Wymagane?" wstawia warunek do zapytania jedynie w przypadku, gdy
zmienna posiada przypisaną wartość.

![Alt text](readme/img/query/query_tester.png?raw=true "Query Tester")

Tester zapytania wyświetla wygenerowane zapytanie w czasie rzeczywistym, aktualizowane po wprowadzeniu każdej zmiany
w definicji zapytania. Generowane są również zmienne zapytania wraz z podstawionymi wartościami stałymi. Oba okna
z wygenerowanym kodem pozwalają na skopiowanie i uruchomienie zapytania. Przycisk uruchom zapytanie generuje wersję
właściwą zapytania i uruchamia je przy pomocy odpowiedniej biblioteki platformy. Wynik zapytania lub błąd wywołania
wyświetlany jest również w oknie testera w formacie JSON.

### Edytor mutacji

Edytor mutacji został podzielony na formularze pozwalające na dostosowanie poszczególnych składowych
mutacji. Skład formularzy zależny jest od wybranego rodzaju operacji. Dostępne operacje obejmują wstawianie,
aktualizację oraz usunięcie danych. Sposób tworzenia mutacji opisany został w sekcji
'Biblioteki generowania kodu'.

![Alt text](readme/img/mutation/mutation_details.png?raw=true "Mutation Details")

Formularz "Mutacja" pozwala na ustawienie podstawowych informacji o mutacji, w tym jego nazwy oraz nazwy tabeli
na której ma być wykonana mutacja. Wybór rodzaju operacji jest zablokowany i możliwy do wyboru jedynie podczas
tworzenia nowej mutacji.

![Alt text](readme/img/mutation/mutation_vars.png?raw=true "Mutation Vars")

Formularz "Zmienne" pozwala na zdefiniowanie zmiennych wykorzystywanych przez mutację. Formularz pozwala na
zdefiniowanie pola przy pomocy nazwy zmiennej, rodzaju zmiennej oraz przypisanej wartości stałej. Wartość stała
wykorzystywana jest podczas testowania mutacji oraz jako wartość domyślna mutacji podczas uruchamiania mutacji
z poziomu wygenerowanej strony.

![Alt text](readme/img/mutation/mutation_where.png?raw=true "Mutation Where")

Formularz "Warunki" pozwala na zdefiniowanie ograniczeń mutacji. Możliwe jest utworzenie dowolnej liczby
warunków łączonych przy pomocy operatorów "and" i "or". Kolejność wprowadzanych warunków wpływa na sposób ich łączenia
przy pomocy operatorów. Definicja pojedynczego warunku pozwala na wybranie pola tabeli, operatora sprawdzającego
warunek, zmiennej, która zostanie wstawiona podczas wywołania mutacji. Możliwa jest także opcja zaznaczenia pola
jako wymagane lub opcjonalne. Odznaczenie opcji "Wymagane?" wstawia warunek do mutacji jedynie w przypadku, gdy
zmienna posiada przypisaną wartość.

![Alt text](readme/img/mutation/mutation_fields.png?raw=true "Mutation Fields")

Formularz "Pola" pozwala na wybranie listy pól wstawianych jako wartości do mutacji. Pola wybierane są z tabeli po
kliknięciu przycisku wyboru pola. W przypadku pola wymaganego przycisk wyboru pola oznaczony jest przy pomocy
symbolu *. Pola ograniczone są jedynie do pól samej tabeli i pól relacji obiektowych (jeden-do-jeden).
Każde z pól opisane jest poprzez nazwę pola oraz typ danych pola. Możliwe jest wybranie zmiennej, której
wartość zostanie przypisana jako źródło wprowadzanego pola mutacji. Dla pól wymaganych dostępna jest również opcja
"Autom.", która oznacza pole jako pole uzupełniane automatycznie podczas uruchamiania mutacji (np. identyfikator pola
uzupełniany przy pomocy sekwencji).

![Alt text](readme/img/mutation/mutation_tester.png?raw=true "Mutation Tester")

Tester mutacji wyświetla wygenerowaną mutację w czasie rzeczywistym, aktualizowaną po wprowadzeniu każdej zmiany
w definicji mutacji. Generowane są również zmienne mutacji wraz z podstawionymi wartościami stałymi. Oba okna
z wygenerowanym kodem pozwalają na skopiowanie i uruchomienie mutacji. Przycisk uruchom mutację generuje wersję
wykonawczą mutacji i uruchamia ją przy pomocy odpowiedniej biblioteki platformy. Pomyślne wykonanie mutacji lub błąd
wywołania wyświetlany jest również w oknie testera w formacie JSON.

### Edytor strony

Edytor strony pozwala na zdefiniowanie wyglądu strony, umiejscowienia komponentów, właściwości komponentów, warunkowego
wyświetlania komponentu oraz akcji wywoływanej przez komponent. Umiejscawianie komponentu na widoku strony zrealizowane
jest za pomocą mechanizmu drag & drop. Edytor strony został podzielony na cztery części: pasek górny odpowiedzialny
za opcje ogólne edytora, pasek boczny lewy zawierający układ strony oraz przybornik komponentów, menu boczne
prawe zawierające opcje dostosowywania komponentu oraz opcji strony i na widok projektowy/poglądowy strony. Zarówno
menu boczne lewe i prawe posiadają opcję ukrycia w celu zwiększenia obszaru wyświetlania widoku projektowego strony.

#### Widok projektowy

![Alt text](readme/img/pageeditor/page_editor.png?raw=true "Page Editor")

![Alt text](readme/img/pageeditor/page_editor_active.png?raw=true "Page Editor Active")

Widok projektowy strony wyświetla umieszczone na stronie komponenty w postaci bloków. Komponenty mające możliwość
posiadania komponentów podrzędnych oznaczone są w postaci kontenerów. Każdy z kontenerów oznaczony został oddzielnym
kolorem. Podczas umiejscawiania komponentów włączony zostaje tryb wyświetlający możliwe pozycje, w których może zostać
umieszczony nowy lub istniejący komponent.

#### Widok poglądowy

![Alt text](readme/img/pageeditor/page_editor_sim.png?raw=true "Page Editor Simulation")

Tryb poglądowy włączany za pomocą opcji paska górnego edytora pozwala na wyświetlenie rzeczywistego widoku generowanej
strony wraz z danymi pobranymi przy pomocy zapytań. Podgląd rzeczywisty jest generowany na żywo, przez platformę,
na podstawie definicji strony w widoku projektowym.

#### Menu górne

![Alt text](readme/img/pageeditor/editor_menu_up.png?raw=true "Page Editor Menu Up")

Menu górne pozwala kolejno na zmianę trybu wyświetlania kolumn (tryb projektowy nieuwzględniający rozmiarów kolumn oraz
dostosowany rozmiarowo do definicji wielkości kolumn), otwarcie i zamknięcie trybu poglądowego strony, odrzucenie
zmian wprowadzonych od ostatniego zapisu strony, zapisanie definicji strony, zaimportowanie definicji strony w formacie
JSON oraz eksport definicji strony w formacie JSON.

#### Menu boczne lewe - układ strony

![Alt text](readme/img/pageeditor/editor_menu_structure.png?raw=true "Page Editor Menu Structure")

Menu boczne lewe umożliwia wyświetlenie drzewa komponentów strony oraz ich umiejscowienia w komponentach nadrzędnych,
tworząc strukturę drzewa strony.

#### Menu boczne lewe - przybornik komponentów

![Alt text](readme/img/pageeditor/editor_menu_lib.png?raw=true "Page Editor Menu Library")

Menu boczne zawiera przybornik komponentów, możliwych od umieszczenia na projektowanej stronie. Komponenty podzielone
zostały na trzy kategorie komponentów: siatki (Kontener, Wiersz, Kolumna), wyświetlania danych oraz wprowadzania danych.

| Nazwa komponentu   | Odpowiednik Vuetify | Opis                                                                                                  | Komponent platformy   |
|--------------------|---------------------|-------------------------------------------------------------------------------------------------------|-----------------------|
| Kontener           | v-container         | Kontener grupujący pozostałe komponenty, podstawowy element siatki strony                             | WidgetContainer.vue   |
| Wiersz             | v-row               | Wiersz grupujacy kolumny siatki strony                                                                | WidgetRow.vue         |
| Kolumna            | v-col               | Najniższy element grupujący siatki strony                                                             | WidgetColumn.vue      | 
| Tekst              | -                   | Pole tekstowe, wyłącznie do odczytu                                                                   | WidgetText.vue        | 
| Ikona              | v-icon              | Ikona biblioteki ikon FontAwesome                                                                     | WidgetIcon.vue        | 
| Karta              | v-card              | Komponent kart w postaci dostosowywalnego panelu                                                      | WidgetCard.vue        | 
| Karuzela           | v-carousel          | Karuzela wysświetlająca tekst oraz obrazy zmieniające się w czasie                                    | WidgetCarousel.vue    |
| Tabela             | v-data-table        | Tabel prezentująca zestaw danych podzielonych na kolumny                                              | WidgetTable.vue       |
| Link               | -                   | Odnośnik do adresu                                                                                    | WidgetLink.vue        |
| Separator          | v-divider           | Separator w postaci prostej linii                                                                     | WidgetDivider.vue     |
| Formularz          | v-form              | Formularz grupujący komponenty wprowadzania danych, wymagany do poprawnego działania walidacji danych | WidgetForm.vue        |
| Pole tekstowe      | v-text-field        | Pole wprowadzania danych, w postaci pojedynczej linii, akceptującej dowolny tekst                     | WidgetTextField.vue   |
| Pole numeryczne    | v-text-field        | Pole wprowadzania danych, w postaci pojedynczej linii, akceptującej dowolną wartość liczbową          | WidgetNumberField.vue |
| Duże pole tekstowe | v-textarea          | Pole wprowadzania danych, w postaci wieloliniowego pola, akceptującego dowolny tekst                  | WidgetTextArea.vue    |
| Pole wyboru        | v-select            | Pole wprowadzania danych przy pomocy zestawu danych w postaci listy wyboru                            | WidgetSelect.vue      |
| Checkbox           | v-checkbox          | Pole wprowadzania danych typu prawda/fałsz                                                            | WidgetCheckbox.vue    |
| Przycisk           | v-button            | Przycisk uruchamiający akcję                                                                          | WidgetButton.vue      |

#### Menu boczne prawe - design

![Alt text](readme/img/pageeditor/editor_menu_design.png?raw=true "Page Editor Menu Design")

Menu boczne prawe udostępnia opcje konfiguracji wyglądu komponentu przy pomocy zdefiniowanego zestawu właściwości,
określonych w definicji komponentu. Rodzaj właściwości komponentu zależy od jego definicji w pliku
`src/lib/widgets.json`. Rodzaje właściwości obejmują: Tak/Nie, Obramowanie, Kolor, Czas trwania, Wartość początkową
pola danych, Wartość liczbową, Parametr strony, Zapytanie, Relację, Pole wyboru, Rozmiar, Suwak wartości,
Wartość tekstową, Tabelę, Pole tabeli oraz Zmienną strony.

#### Menu boczne prawe - warunki

![Alt text](readme/img/pageeditor/editor_menu_conditions.png?raw=true "Page Editor Menu Conditions")

Menu boczne prawe pozwala na zdefiniowanie warunkowego wyświetlania komponentów na podstawie danych pobranych przy
pomocy zapytania GraphQL. Formularz każdego warunku obejmuje zdefiniowanie nazwy tabeli, pola tabeli, rodzaju operatora
warunku oraz wartości sprawdzanej. Podczas generowania komponentu, warunek wyświetlania jest budowany
i sprawdzany w oparciu o dane zwrotne zapytania. Rodzaje warunków sprawdzających zostały podane w tabeli poniżej.

| Warunek | Warunek języka GraphQL | Rodzaje pól GraphQL                                   |
|---------|------------------------|-------------------------------------------------------|
| =       | _eq                    | Text / Int / bigint / float8 /  Boolean / date / time |
| !=      | _neq                   | Text / Int / bigint / float8 / date / time            | 
| \>      | _gt                    | Text / Int / bigint / float8 / date / time            |  
| \>=     | _gte                   | Text / Int / bigint / float8 / date / time            | 
| =null   | _is_null               | Text / Int / bigint / float8 / date / time            | 
| !=null  | -                      | Text / Int / bigint / float8 / date / time            |
| \<      | _lt                    | Text / Int / bigint / float8 / date / time            |
| \<=     | _lte                   | Text / Int / bigint / float8 / date / time            | 
| %       | _like                  | Text                                                  |
| !%      | _nlike                 | Text                                                  |

#### Menu boczne prawe - akcje

![Alt text](readme/img/pageeditor/editor_menu_actions.png?raw=true "Page Editor Menu Actions")

Menu budowania akcji komponentu pozwala na wprowadzenia definicji dowolnej liczby akcji wykonywanych w kolejności po
wywołaniu akcji komponentu. Akcje pozwalają na zdefiniowanie rodzaju, celu wykonywanej akcji oraz zestawu argumentów,
których definicja jest zależna od rodzaju wybranej akcji. W przypadku przypisania akcji do komponentu znajdującego się
w formularzu, przed wykonaniem akcji wywoływana jest wbudowana funkcja walidacyjna, sprawdzająca poprawność
wprowadzonych danych, przy pomocy wszystkich komponentów formularza. Lista dostępnych akcji została podana w tabeli
poniżej.

| Akcja                       | Cel akcji                | Argumenty                                                                                | Działanie                                           |
|-----------------------------|--------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------------|
| Przejdź do strony           | Jedna ze stron aplikacji | Parametry adresu URL wybranej strony                                                     | Przejście do wybranej strony aplikacji              |
| Uruchom mutację             | Nazwa mutacji            | Zmienne strony zmapowane na zmienne mutacji oraz treść błędu wyświetlanego użytkownikowi | Wywołanie mutacji                                   |
| Otwórz dialog potwierdzenia | Automatyczny             | Tytuł oraz opis dialogu                                                                  | Otwarcie dialogu i oczekiwanie na wybór użytkownika |

#### Menu boczne prawe - zmienne strony

![Alt text](readme/img/pageeditor/editor_menu_vars.png?raw=true "Page Editor Menu Variables")

Menu zmiennych obejmuje zmienne utworzone i przypisane do obecnie edytowanej strony. Celem zmiennych jest przechowywanie
stałych wartości tekstowych i liczbowych wyświetlanych za pomocą komponentów oraz wartości wprowadzanych poprzez
komponenty wprowadzania danych. Każdy z komponentów wprowadzania posiada możliwość przypisania zmiennej strony, do
której wprowadzana będzie wartość przy pomocy wybranego pola. Zmienne te mogą następnie posłużyć jako argumenty
wywoływania zapytań i mutacji. Zmienne mogą być dodawane w dowolnej ilości i mogą obejmować zmienne typu tekstowego
i liczbowego.

#### Menu boczne prawe - parametry strony

![Alt text](readme/img/pageeditor/editor_menu_params.png?raw=true "Page Editor Menu Parameters")

Menu parametrów działa analogicznie do zmiennych strony, z tą różnicą, że wartości parametrów mogą zostać
zainicjowane jedynie poprzez parametry URL wybranej strony. Podczas wczytywania strony aplikacji, parametry przekazane
w adresie URL są przypisywane do zmiennych wykorzystywanych przez komponenty strony.
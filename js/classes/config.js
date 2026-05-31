const PRODUCT_STORAGE_KEY = "pharma_products";
const CART_STORAGE_KEY = "pharma_cart";
const ORDER_STORAGE_KEY = "pharma_orders";
const ADMIN_AUTH_KEY = "pharmacareAdminLoggedIn";
const ADMIN_TOKEN_KEY = "pharmacareAdminToken";
const API_BASE_URL = "http://localhost:5000/api";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160'%3E%3Crect width='200' height='160' fill='%23e8f5e9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='%234a7c59'%3EPa imazh%3C/text%3E%3C/svg%3E";

const defaultProducts = [
    { id: 1, name: "Paracetamol", price: 5, category: "Medicine", discount: true, img: "images/Paracetamol.jpg" },
    { id: 2, name: "Ibuprofen", price: 8, category: "Medicine", discount: false, img: "images/Ibuprofen.jpg" },
    { id: 3, name: "Vitamina C", price: 10, category: "Vitamins", discount: true, img: "images/Vitamin C.jpeg" },
    { id: 4, name: "Shampo për Bebe", price: 12, category: "Baby Products", discount: false, img: "images/BabyShampoo.jpg" },
    { id: 5, name: "Multivitamina", price: 15, category: "Vitamins", discount: false, img: "images/Multivitamins.jpeg" },
    { id: 6, name: "Krem për Irritim nga Pelenat", price: 7, category: "Baby Products", discount: true, img: "images/Diaper Rash Cream.jpeg" },
    { id: 7, name: "Shurup për Kollë", price: 9, category: "Medicine", discount: false, img: "images/CoughSyrup.jpg" },
    { id: 8, name: "La Roche-Posay", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay.jpeg" },
    { id: 9, name: "Losion për Bebe", price: 14, category: "Baby Products", discount: false, img: "images/BabyLotion.jpg" },
    { id: 10, name: "La Roche-Posay SPF", price: 13, category: "Skincare", discount: true, img: "images/La Roche-Posay SPF.jpeg" },
    { id: 11, name: "Shkëlqyes Buzësh YSL", price: 6, category: "Beauty & Hair Care", discount: false, img: "images/YSL.jpeg" },
    { id: 12, name: "Kerastase Gloss Absolu", price: 8, category: "Beauty & Hair Care", discount: false, img: "images/Kerastase Gloss Absolu.jpeg" },
    { id: 13, name: "Huda Beauty Easy Bake", price: 9, category: "Beauty & Hair Care", discount: true, img: "images/Huda Beauty Easy Bake.jpeg" },
    { id: 14, name: "Color WOW", price: 12, category: "Beauty & Hair Care", discount: false, img: "images/Color WOW.jpeg" },
    { id: 15, name: "Paletë Dior", price: 10, category: "Beauty & Hair Care", discount: true, img: "images/Dior.jpeg" },
    { id: 16, name: "Gisou", price: 14, category: "Beauty & Hair Care", discount: false, img: "images/Gisou.jpeg" },
    { id: 17, name: "La Roche-Posay 2", price: 11, category: "Skincare", discount: true, img: "images/La Roche-Posay (2).jpeg" },
    { id: 18, name: "Princess Rose", price: 13, category: "Beauty & Hair Care", discount: false, img: "images/Princess Rose.jpeg" },
    { id: 19, name: "SPF", price: 9, category: "Skincare", discount: true, img: "images/SPF.jpeg" }
];

const categoryLabels = {
    Medicine: "Barna",
    Vitamins: "Vitamina",
    Skincare: "Kujdes për Lëkurën",
    "Baby Products": "Produkte për Fëmijë",
    "Beauty & Hair Care": "Bukuri & Kujdes për Flokët"
};

function getCategoryLabel(category) {
    return categoryLabels[category] || category;
}

const healthData = {
    asthma: { title: "Astma & Alergjitë", tips: ["Përdorni inhalatorin sipas udhëzimit", "Shmangni shkaktarët e njohur si pluhuri, poleni dhe kafshët shtëpiake", "Mbani dritaret mbyllur në ditët me shumë polen", "Mbani me vete antihistaminik për reagime të papritura"], warning: "Kërkoni ndihmë urgjente nëse frymëmarrja bëhet shumë e vështirë." },
    cold: { title: "Ftohja & Gripi", tips: ["Pushoni dhe pini mjaftueshëm ujë", "Përdorni paracetamol ose ibuprofen për temperaturë", "Përdorni sprej nazal për bllokimin e hundëve", "Vaksina e gripit rekomandohet çdo vjeshtë"], warning: "Kontaktoni mjekun nëse simptomat zgjasin më shumë se 10 ditë ose përkeqësohen." },
    coronavirus: { title: "Coronavirus", tips: ["Qëndroni të përditësuar me vaksinat", "Lani duart shpesh për të paktën 20 sekonda", "Izolohuni nëse rezultoni pozitiv", "Mbani maskë në ambiente të mbyllura me shumë njerëz nëse jeni të rrezikuar"], warning: "Telefononi urgjencën nëse keni vështirësi në frymëmarrje ose dhimbje gjoksi." },
    diabetes: { title: "Diabeti", tips: ["Kontrolloni rregullisht sheqerin në gjak", "Ndiqni një dietë të balancuar me pak sheqer", "Bëni të paktën 30 minuta aktivitet fizik në ditë", "Merrni ilaçet në të njëjtën orë çdo ditë"], warning: "Shenjat e sheqerit të ulët: marramendje, djersitje, konfuzion - veproni shpejt." },
    hair: { title: "Kujdesi për Flokët", tips: ["Përdorni shampo pa sulfate për skalp të ndjeshëm", "Aplikoni trajtim ushqyes një herë në javë", "Shmangni nxehtësinë e tepërt gjatë stilimit", "Masazhoni skalpin për të nxitur qarkullimin"], warning: "Rënia e papritur e flokëve mund të tregojë mungesa ushqyese - konsultohuni me mjekun." },
    mens: { title: "Shëndeti i Burrave", tips: ["Bëni kontroll rutinë çdo vit", "Kontrolloni rregullisht tensionin dhe kolesterolin", "Mbani peshë të shëndetshme me dietë dhe aktivitet", "Flisni hapur për shëndetin mendor"], warning: "Mos injoroni dhimbjen në gjoks, vështirësinë në frymëmarrje ose nyje të pazakonta." },
    mother: { title: "Nëna & Foshnja", tips: ["Merrni acid folik para dhe gjatë shtatzënisë së hershme", "Ndiqni të gjitha vizitat prenatale", "Ushqeni me gji nëse është e mundur në 6 muajt e parë", "Siguroni shtëpinë për foshnjën para se të fillojë të zvarritet"], warning: "Kontaktoni menjëherë maminë ose mjekun nëse keni dhimbje ose gjakderdhje të pazakontë." },
    doctor: { title: "Këshilla Online nga Mjeku", tips: ["Përdorni konsultën online për shqetësime jo urgjente", "Përgatitni simptomat dhe listën e ilaçeve", "Mbani shënime gjatë konsultës", "Bëni vizitë fizike nëse simptomat vazhdojnë"], warning: "Këshillat online nuk zëvendësojnë kujdesin urgjent - telefononi 112 në rrezik." },
    oral: { title: "Shëndeti Oral", tips: ["Lani dhëmbët dy herë në ditë me pastë me fluor", "Përdorni fill dentar të paktën një herë në ditë", "Vizitoni dentistin çdo 6 muaj", "Shmangni pijet me shumë sheqer dhe duhanin"], warning: "Dhimbja e vazhdueshme e dhëmbit ose gjakderdhja e mishrave duhet kontrolluar nga dentisti." },
    pain: { title: "Menaxhimi i Dhimbjes", tips: ["Përdorni paracetamol për dhimbje të lehta ose mesatare", "Aplikoni kompresa të ngrohta ose të ftohta për dhimbje muskulare", "Ibuprofeni ndihmon kundër inflamacionit", "Mos e tejkaloni dozën e rekomanduar"], warning: "Dhimbja kronike ose e fortë kërkon vlerësim mjekësor - mos u vetë-mjekoni për kohë të gjatë." },
    skin: { title: "Kujdesi për Lëkurën", tips: ["Aplikoni çdo ditë krem mbrojtës SPF 30+", "Hidratoni lëkurën në mëngjes dhe në mbrëmje", "Pini mjaftueshëm ujë gjatë ditës", "Shmangni sapunët e ashpër që e thajnë lëkurën"], warning: "Nishanet e reja ose që ndryshojnë duhet të kontrollohen nga dermatologu." },
    smoking: { title: "Ndalimi i Duhanit", tips: ["Vendosni një datë për ta lënë dhe qëndrojini planit", "Përdorni nikotinë në formë ngjitëse ose çamçakëz për dëshirat", "Shmangni shkaktarët si alkooli, kafeja dhe situatat sociale", "Bashkohuni me një grup mbështetës ose përdorni një aplikacion ndihmës"], warning: "Flisni me farmacistin për medikamente që ndihmojnë në ndalimin e duhanit." }
};

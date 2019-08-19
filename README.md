## Flappy Bird AI
Hata düzeltmeleri, oyundaki ufak iyileştirmeler ve görsel tasarım için istekleri kabul ediyorum. Amaç, kodu oluşturduğum sinir ağı kütüphanesiyle bir "nöro-evrim" dersi için bir temel olarak kullanmak olduğundan, kodu daha karmaşık hale getirmek istemiyorum.  

## Flappy Bird Nedir?
Flappy Bird, Nguyễn Hà Đông (Dong Nguyen) tarafından akıllı telefonlar için yapılan bir oyundur. Aslında bu oyun Iphone 5 için 5 Mart 2013'te piyasaya sürüldü, fakat oyunda yapılan küçük bir güncelleme yüzünden oyun aniden bir trend haline gelmiştir. 2014 ise oyun Amerika ve Çin gibi ülkelerde en çok bedava indirilen oyunlar listesine girmiştir.

**a) Etimoloji**  
"Flap" sözcüğü " kanat çırpma " yansıma söz öbeğinin İngilizce karşılığıdır. Oyunda bahsi geçen kanat çırpma, kuşun havada çırpınması demektir.

**b) İçeriği**  
Flappy Bird, tek kişilik bir oyundur.Kanat çırpan kuş her komutta yükselir ve bariyerlerin arasından geçmeye çalışır. Bariyerlere veya yere değen kuş ölür ve oyun yeniden başlar.

- Kaynak [Wikipedia] (https://tr.wikipedia.org/wiki/Flappy_Bird)

## Kullanımı

- **Yukarı Ok**: Hızı bire sabitler.
- **Sağ Ok**: Hızı bir arttırır.
- **Aşağı Ok**: Hızı on arttırır.
- **Sol Ok**: Hızı bir azaldır.

*En yüksek hız yüz, en düşük hız ise sıfırdır. Hız sıfıra alındığı taktirde her şey duracaktır.*

    const POPULATION = 100; // Populasyonu değiştirmek için bu kodu kullanabilirsiniz.
    const PERCENT = 0.1; // Gösterilen kuş sayısını düşürerek performansı arttırmak için birde biçiminde bu değişkeni değiştirebilirsiniz.
    mutationRate: 0.01 // Kuşların bir sonraki nesle aktarıldığı sırada mutasyona uğrama şansını değiştirmek için kullanın.

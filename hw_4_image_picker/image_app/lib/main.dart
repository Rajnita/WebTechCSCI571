import 'dart:io';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Album 571',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomePageState(),
    );
  }
}

enum ImageSourceType { gallery, camera }

var photoList = [];

class HomePageState extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return HomePage();
  }
}

class HomePage extends State<HomePageState> with WidgetsBindingObserver {
  // Tap to enter picking image view
  void getPhoto(BuildContext context, var type) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => ImageFromGalleryEx(type)),
    ).then((value) => setState(() {}));
  }

  // Tap to enter full screen image view
  void fullScreenImage(BuildContext context, var path) {
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => FullScreenState(path)));
  }

  getImageFromFile(path) {
    File _image = File(path);
    return Image.file(
      _image,
      fit: BoxFit.cover,
    );
  }

  List<Widget> getListOfImages() {
    List<Widget> list = <Widget>[];
    for (int i = 0; i < photoList.length; i++) {
      Widget w = GestureDetector(
          onTap: () {
            return fullScreenImage(context, photoList[i]);
          },
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15.0),
            child: getImageFromFile(photoList[i]),
          ));
      list.add(w);
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    //Grid view
    Widget gridSection = GridView.count(
        crossAxisCount: 3, crossAxisSpacing: 5, children: getListOfImages());

    // Our two buttons - one for gallery imgs, one for camera...
    Widget buttonSection = Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        MaterialButton(
          color: Colors.blue,
          child: const Text(
            "Add from Gallery",
            style:
                TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
          ),
          onPressed: () {
            getPhoto(context, ImageSourceType.gallery);
          },
        ),
        MaterialButton(
          color: Colors.blue,
          child: const Text(
            "Use Camera",
            style:
                TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
          ),
          onPressed: () {
            getPhoto(context, ImageSourceType.camera);
          },
        ),
      ],
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text("Album 571"),
      ),
      body: Stack(
        children: [
          gridSection,
          Column(children: [const Spacer(), buttonSection])
        ],
      ),
    );
  }
}

// full screen image showing: two classes
class FullScreenState extends StatefulWidget {
  final path;

  FullScreenState(this.path);

  @override
  FullScreenImg createState() => FullScreenImg(this.path);
}

class FullScreenImg extends State<FullScreenState> {
  var path;
  var img;
  var width;
  var height;

  FullScreenImg(this.path);

  @override
  void initState() {
    super.initState();
    img = Image(image: FileImage(File(path)));
    // get image width and height
    img.image.resolve(ImageConfiguration()).addListener(
      ImageStreamListener(
        (ImageInfo info, bool _) {
          width = info.image.width;
          height = info.image.height;
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    String wd = "Image width: " + width.toString() + "px";
    String h = "Image height: " + height.toString() + "px";

    Widget centre = Align(
        alignment: Alignment.center,
        child: Text(wd,
            textAlign: TextAlign.center,
            style: (const TextStyle(fontWeight: FontWeight.bold))));

    Widget centre2 = Align(
        alignment: Alignment.center,
        child: Text(h,
            textAlign: TextAlign.center,
            style: (const TextStyle(fontWeight: FontWeight.bold))));

    Widget imageCentre = Align(
        alignment: Alignment.center,
        child: Image.file(
          File(path),
        ));
    Widget stack = Stack(
      children: [
        imageCentre,
        Column(
          children: [const Spacer(), centre, centre2],
        )
      ],
    );
    return Scaffold(
        appBar: AppBar(title: const Text("Full screen image")),
        body: Container(
            // padding: const EdgeInsets.only(top:10, right: 3),
            alignment: Alignment.center,
            child: stack));
  }
}

class ImageFromGalleryEx extends StatefulWidget {
  final type;

  ImageFromGalleryEx(this.type);

  @override
  ImageFromGalleryExState createState() => ImageFromGalleryExState(this.type);
}

class ImageFromGalleryExState extends State<ImageFromGalleryEx> {
  var _image;
  var imagePicker;
  var type;

  ImageFromGalleryExState(this.type);

  @override
  void initState() {
    super.initState();
    imagePicker = ImagePicker();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(type == ImageSourceType.camera
              ? "Image from Camera"
              : "Image from Gallery")),
      body: Column(
        children: <Widget>[
          const SizedBox(
            height: 52,
          ),
          Center(
            child: GestureDetector(
              onTap: () async {
                var source = type == ImageSourceType.camera
                    ? ImageSource.camera
                    : ImageSource.gallery;
                XFile image = await imagePicker.pickImage(
                    source: source,
                    imageQuality: 50,
                    preferredCameraDevice: CameraDevice.front);

                Directory appDocumentsDirectory =
                    await getApplicationDocumentsDirectory();
                // correct path to save file for this app
                String prePath = appDocumentsDirectory.path;
                var rand = Random();
                // random int as the photo name
                String randomInt = rand.nextInt(99999999).toString();
                String newPath = "$prePath/$randomInt.jpg";
                File oldImage = File(image.path);
                // copy the image from cache to a safe place
                final File newImage = await oldImage.copy(newPath);

                setState(() {
                  _image = newImage;
                  // save the path to a global variable
                  // then the root view can update the grid list
                  photoList.add(newImage.path);
                });
              },
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(color: Colors.red[200]),
                child: _image != null
                    ? Image.file(
                        _image,
                        width: 200.0,
                        height: 200.0,
                        fit: BoxFit.fitHeight,
                      )
                    : Container(
                        decoration: BoxDecoration(color: Colors.red[200]),
                        width: 200,
                        height: 200,
                        child: Icon(
                          Icons.camera_alt,
                          color: Colors.grey[800],
                        ),
                      ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

# Changelog

> Breaking / Enhancements / Bug Fixes

## 0.3.0

* Fixed an issue where if this library was called
  on top of the same CSS file, it would replace
  the content. Now it will append it.
* Bump ttf2svg to 1.1.0

## 0.2.1

##### Enhancements

* No more external dependencies ( just `fontforge` )
  [Julian Grinblat](https://github.com/perrin4869)
  [#36](https://github.com/agentk/fontfacegen/pull/36)

## 0.2.0

##### Enhancements

* Add font subset support  
  [Julian Grinblat](https://github.com/perrin4869)
  [#26](https://github.com/agentk/fontfacegen/pull/26)

##### Bug Fixes

* Suggest batik-ttf2svg instead of ttf2svg on Mac  
  [Daniele De Nobili](https://github.com/omoikane)
  [#24](https://github.com/agentk/fontfacegen/issues/24)

# Command Structure


|  Cmd Name   | Cmd ID |  Params   |             |         |         |         |          |          |          |          |       |
| :---------: | :----: | :-------: | :---------: | :-----: | :-----: | :-----: | :------: | :------: | :------: | :------: | :---: |
|    Clear    |   0    |           |
|    Pixel    |   1    |    ID     |   Upper X   | Lower X | Upper Y | Lower Y |    Z     |
|   Colour    |   2    |     R     |      G      |    B    |   A?    |
| Fill Status |   3    |  Filled   |
| Draw Width  |   4    |   Width   |
|    Rect     |   5    |    ID     |   Upper X   | Lower X | Upper Y | Lower Y | Upper W  | Lower W  | Upper H  | Lower H  |   Z   |
|    Line     |   6    |    ID     |   Upper X   | Lower X | Upper Y | Lower Y | Upper X2 | Lower X2 | Upper Y2 | Lower Y2 |   Z   |
|   Circle    |   7    |    ID     |   Upper X   | Lower X | Upper Y | Lower Y | Upper R  | Lower R  |    Z     |
|   Update    |   8    |  Item ID  | Update Type |  Data   |  Data   |  Data   |   ...    |
|   Delete    |   9    |  Item ID  |
|   Sprite    |   10   |    ID     |  Sprite ID  | Upper X | Lower X | Upper Y | Lower Y  |    Z     |
|    Group    |   11   |  Item ID  | ID of Group |
|   Render    |   12   |
|    Init     |   13   | Init Cmd  |
| New Sprite  |   14   | Sprite ID |    Width    | Height  |  Data   |  Data   |   ...    |

## Notes

Each entry in the table represents One Byte (8 bits).

Some parameters are split into Upper and Lower forms. This is to allow the support of values outside of the range of 1 byte, allowing numbers between ±32636, which is larger than the default range of 0-255. Examples of functions to convert a regular JS number into this format and back can be seen in `canvas.tsx`.

Update also expects all parameters in this format for consistency.

For more information about New Sprite, see the Readme, bearing in mind the maximum size of a Jacdac packet is 236 bytes. 4 bytes are used for header data in this command, so 232 bytes are supported for sprite data, when split into bits this means sprites can have a maximum size (ATM) of 1,856 pixels, or 43x43.

## Update Commands

|  Update Type  | Update ID |   Params    |             |          |          |         |         |          |          |
| :-----------: | :-------: | :---------: | :---------: | :------: | :------: | :-----: | :-----: | :------: | :------: |
|  Visibility   |     0     |  Upper Bit  |  Lower Bit  |
|   Translate   |     1     |  Upper XΔ   |  Lower XΔ   | Upper YΔ | Lower YΔ |
|   Position    |     2     |   Upper X   |   Lower X   | Upper Y  | Lower Y  |
|  Resize Rect  |     3     |   Upper W   |  Lower  W   | Upper H  | Lower H  |
| Resize Circle |     3     |   Upper R   |   Lower R   |
|  Resize Line  |     3     |  Upper X2   |  Lower X2   | Upper Y2 | Lower Y2 |
|     Angle     |     4     | Upper Angle | Lower Angle |
|    Colour     |     5     |   Upper R   |   Lower R   | Upper G  | Lower G  | Upper B | Lower B | Upper A? | Lower A? |
|     Width     |     6     | Upper Width | Lower Width |
|     Fill      |     7     | Upper Fill  | Lower Fill  |
|     Layer     |     8     |   Upper Z   |   Lower Z   |
|     Scale     |     9     | Upper Scale | Lower Scale |


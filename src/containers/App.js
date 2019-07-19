import React, { Component } from 'react';
import TableHead from '../components/TableHead';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [[], [], []],
      total: {
        ctns: 0,
        totQty: 0,
        volume: 0,
        empty: 0,
        amoutRmb: 0,
        GW: 0,
        NW: 0
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.tableRows = this.tableRows.bind(this);
    this.totalRow = this.totalRow.bind(this);
    this.parseData = this.parseData.bind(this);
  }

  // ПРЕОБРАЗОВЫВАЕМ STATE В МАССИВ ОБЪЕКТОВ ДЛЯ ЛУЧШЕЙ ЧИТАЕМОСТИ (КАЖДЫЙ ОБЪЕКТ - СТРОКА НАШЕЙ ТАБЛИЦЫ)
  parseData() {
    const { rows, total } = this.state;
    const headTitles = [
      'Int code',
      'Our model',
      'Factory model',
      'goods name',
      'ctn#',
      'ctns',
      'qty/ctn',
      'tot.qty',
      'dimension',
      'volume',
      'ctns * dimension',
      'amout(rmb)',
      'volume/pic',
      'unit',
      'G.W/ctn',
      'ctns * G.W/ctn',
      'G.W',
      'N.W/ctn',
      'N.W',
      'box weight',
      'ready date'
    ];

    const rowsArr = rows.map(array => {
      const obj = {};
      for (let i = 0; i < 21; i++) {
        obj[headTitles[i]] = array[i];
      }
      return obj;
    });

    const data = JSON.stringify({ items: rowsArr, totals: total });

    console.log(data);
  }

  // ОБРАБОТЧИК ВВОДИМЫХ ДАННЫХ В ПОЛЯ ТАБЛИЦЫ
  handleChange(e) {
    const { rows, total } = this.state;
    const rowIndex = parseInt(e.target.getAttribute('data-row'), 10);
    const columnIndex = parseInt(e.target.getAttribute('data-column'), 10);

    // функция подсчета total-ов
    const calc = x => {
      let value = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][x] !== undefined && !isNaN(rows[i][x])) {
          value += parseInt(rows[i][x], 10);
        }
      }
      return value;
    };
    this.setState({
      ...this.state,
      rows: rows.map((array, index) => {
        for (let i = 0; i < 21; i++) {
          if (rowIndex === index && i === columnIndex) {
            array[i] = parseInt(e.target.value, 10);
          }
          array[7] = array[5] * array[6];
          array[10] = array[5] * array[8];
          array[15] = array[5] * array[14];
        }
        return array;
      }),
      total: {
        ...total,
        ctns: calc(5),
        totQty: calc(7),
        volume: calc(9),
        empty: calc(10),
        amoutRmb: calc(11),
        GW: calc(16),
        NW: calc(18)
      }
    });
  }

  // ВОЗВРАЩАЕМ РЕДАКТИРУЕМЫЕ СТРОКИ ТАБЛИЦЫ
  tableRows() {
    const { rows } = this.state;
    return rows.map((row, index) => {
      const arrayOfRowCells = [];
      for (let i = 0; i < 21; i += 1) {
        if (i !== 7 && i !== 10 && i !== 15) {
          // исключаем нередактируемые ячейки
          arrayOfRowCells.push(
            <td key={`${index}-${i}`} data-row={index} data-column={i}>
              <input
                type="text"
                value={row[i] ? row[i] : null}
                onChange={event => {
                  event.persist();
                  this.handleChange(event);
                }}
                data-row={index}
                data-column={i}
              />
            </td>
          );
        } else {
          // выводим нередактируемые ячейки (с подсчетом в реальном времени)
          arrayOfRowCells.push(
            <td
              className="calculated-field"
              key={`${index}-${i}`}
              data-row={index}
              data-column={i}>
              {row[i] ? row[i] : null}
            </td>
          );
        }
      }
      return <tr key={index}>{arrayOfRowCells}</tr>;
    });
  }

  // ПОСЛЕДНЯЯ СТРОКА (ПОДСЧЕТЫ TOTAL)
  totalRow() {
    const { total } = this.state;
    return (
      <tr>
        <td colSpan="5">TOTAL:</td>
        <td className="calculated-field">{total.ctns}</td>
        <td></td>
        <td className="calculated-field">{total.totQty}</td>
        <td></td>
        <td className="calculated-field">{total.volume}</td>
        <td className="calculated-field">{total.empty}</td>
        <td className="calculated-field">{total.amoutRmb}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td className="calculated-field">{total.GW}</td>
        <td></td>
        <td className="calculated-field">{total.NW}</td>
        <td></td>
        <td></td>
      </tr>
    );
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <TableHead /> {/* ШАПКА ТАБЛИЦЫ */}
            {this.tableRows()} {/* РАБОЧИЕ СТРОКИ ТАБЛИЦЫ */}
            {this.totalRow()} {/* ПОСЛЕДНЯЯ СТРОКА С ПОДСЧЕТАМИ */}
          </tbody>
        </table>
        <button type="button" onClick={this.parseData}>
          Спарсить данные
        </button>
      </div>
    );
  }
}
export default App;

import React, { Component } from 'react';
import TableHead from '../components/TableHead';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [[], [], []],
      total: {
        ctns: '',
        totQty: '',
        volume: '',
        empty1: '',
        amoutRmb: '',
        GW: '',
        NW: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.tableRows = this.tableRows.bind(this);
    this.totalRow = this.totalRow.bind(this);
  }

  // ОБРАБОТЧИК ВВОДИМЫХ ДАННЫХ В ПОЛЯ ТАБЛИЦЫ
  handleChange(e) {
    const { rows, total } = this.state;
    const rowIndex = e.target.getAttribute('data-row');
    const columnIndex = e.target.getAttribute('data-column');

    const calc = () =>
      rows.reduce((prevValue, curValue) => prevValue + curValue[5], 0);

    this.setState(prevState => ({
      ...prevState,
      rows: rows.map((item, index) => {
        if (index !== rowIndex) {
          return item;
        }
        return item.map((itemj, indexj) =>
          indexj === columnIndex ? e.target.value : itemj
        );
      }),
      total: {
        ...total,
        ctns: calc
      }
    }));
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
                value={row[i]}
                onChange={this.handleChange}
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
              value={row[i]}
              key={`${index}-${i}`}
              data-row={index}
              data-column={i}></td>
          );
        }
      }
      return <tr key={Math.random()}>{arrayOfRowCells}</tr>;
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
        <td className="calculated-field">1,44</td>
        <td></td>
        <td className="calculated-field">1,44</td>
        <td className="calculated-field">1,44</td>
        <td className="calculated-field">1,44</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td className="calculated-field">1,44</td>
        <td></td>
        <td className="calculated-field">1,44</td>
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
      </div>
    );
  }
}
export default App;

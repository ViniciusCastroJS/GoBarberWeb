import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../hooks/auth';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css'
import api from '../../services/api';
import {isToday, format} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { parseISO, isAfter } from 'date-fns';
import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Profile from '../Profile';
import { Header, HeaderContent, Schedule, Container, Content, NextAppointment, Section, Appointment, Calendar } from './styles';
import LogoImg from '../../assets/Logo.svg';


interface IMonthAvailability {
    day: number;
    available: boolean;
}

interface IAppointment {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatar_url: string;
    }
}


const Dashboard: React.FC = () => {
    
    
    const { signOut, user } = useAuth();
    const [dateSelected, SetDateSelected] = useState( new Date());
    const [currentMonth, SetcurrentMonth] = useState( new Date());
    const [Availabilitymonth, SetAvailabilitymonth] = useState<IMonthAvailability[]>([]);
    const [appointmentsArray, SetAppointmentsArray] = useState<IAppointment[]>([]);

   
    useEffect( ()=>{
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1
            }
        }).then( response => SetAvailabilitymonth(response.data))
    }, [currentMonth, user.id]);

    useEffect(
        () => {
            api.get<IAppointment[]>("/appointments/me", {
                params: {
                    year: dateSelected.getFullYear(),
                    month: dateSelected.getMonth(),
                    day: dateSelected.getDate()
                }
            }).then(
                response => {
                    const appointmentFormatted = response.data.map(
                        item => {
                            return {
                                ...item,
                                hourFormatted: format( parseISO(item.date), "HH:mm")
                            }
                        }
                    )
                
                    SetAppointmentsArray(appointmentFormatted);
                }
            )
        }, [dateSelected]
    )


    const handleClickCalendar = useCallback(
        (day: Date, modifiers:DayModifiers ) => {
            if (modifiers.available && !modifiers.disabled) {
                SetDateSelected(day);
            }
        },[]
    )

    const disableDays = useMemo(
        () => {
            const dates = Availabilitymonth
            .filter( Monthday => Monthday.available == false)
            .map( item => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                
                return new Date(year, month, item.day);
            })

            return dates;
        },[currentMonth, Availabilitymonth]
    );

    const selectedDateAtText = useMemo(
        () => {
            return format(dateSelected ,"'Dia' dd 'de' MMMM", {
                locale: ptBR
            })
        }, [dateSelected]
    );

    const selectedWeek = useMemo(
        () => {
            return format(dateSelected ,"cccc", {
                locale: ptBR
            })
        }, [dateSelected]
    );

    const morningAppointments = useMemo(
        () => {
            return appointmentsArray.filter(
                item => {
                    return parseISO(item.date).getHours() < 12;
                }
            )
        }, [appointmentsArray]
    );

    const eveningAppointments = useMemo(
        () => {
            return appointmentsArray.filter(
                item => {
                    return parseISO(item.date).getHours() >= 12;
                }
            )
        }, [appointmentsArray]
    );

    const nextAppointments = useMemo(
        () => {
            return appointmentsArray.find(
                item => isAfter(parseISO(item.date), new Date())
            );
        }, [appointmentsArray]
    );

    const handleMonth = useCallback(
        (month: Date) => {
            SetcurrentMonth(month);
        }, []
    );

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={LogoImg} alt="GoBarber"/>
                    <Profile>
                        <img src={user.avatar_url }></img>
                        <div>
                            <span>Bem-vindo</span>
                            <Link to="/profile">
                            <strong>{ user.name}</strong>
                            </Link>
                        </div>
                    </Profile>

                    <button onClick={signOut} type='button'>
                        <FiPower/>
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários Agendados:</h1>
                    <p>
                        {isToday(dateSelected) && <span>Hoje</span>}
                        <span>{selectedDateAtText}</span>
                        <span>{selectedWeek}</span>
                    </p>

                    {isToday(dateSelected) && nextAppointments && (
                        
                        <NextAppointment>
                        <strong>Agendamento a seguir</strong>
                        <div>
                            <img src={nextAppointments.user.avatar_url}/>
                            <strong>{nextAppointments.user.name}</strong>
                            <span>
                                <FiClock/>
                                {nextAppointments.hourFormatted}
                            </span>
                        </div>
                    </NextAppointment>

                    )}
                    <Section>
                        <strong> Manhã </strong>

                        { morningAppointments.length == 0 && (
                            <p>
                                Nenhum Agendamento nesse Período.
                            </p>
                        )}

                        { morningAppointments.map(
                            item => (
                                <Appointment key={item.id}>
                                    <span>
                                        <FiClock/>
                                        {item.hourFormatted}                                   
                                    </span>

                                    <div>
                                        <img
                                        src={item.user.avatar_url}
                                        alt={item.user.name}
                                        />
                                        <strong>{item.user.name}</strong>
                                    </div>
                                </Appointment>
                            )
                        )}

                        <strong> Tarde </strong>

                        { eveningAppointments.length == 0 && (
                            <p>
                                Nenhum Agendamento nesse Período.
                            </p>
                        )}

                        { eveningAppointments.map(
                            item => (
                                <Appointment key={item.id}>
                                    <span>
                                        <FiClock/>
                                        {item.hourFormatted}                                   
                                    </span>

                                    <div>
                                        <img
                                        src={item.user.avatar_url}
                                        alt={item.user.name}
                                        />
                                        <strong>{item.user.name}</strong>
                                    </div>
                                </Appointment>
                            )
                        )}
                    </Section>
                </Schedule>

                <Calendar>
                    <DayPicker
                    weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                    fromMonth={new Date()}
                    disabledDays={[
                        {daysOfWeek: [0], ...disableDays}
                    ]}
                    onMonthChange={handleMonth}
                    onDayClick={handleClickCalendar}
                    modifiers={{
                        available: { daysOfWeek: [1, 2, 3 ,4 , 5 , 6]}
                    }}
                    months={[
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro'
                    ]}
                    selectedDays={dateSelected}
                    />
                </Calendar>
            </Content>
        </Container>
    )
}

export default Dashboard;


 


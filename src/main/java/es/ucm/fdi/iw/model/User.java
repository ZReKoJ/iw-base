package es.ucm.fdi.iw.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

@Entity
public class User {
	
	private long id;
	private String nickname;
	private String password;
	private int win;
	private int lose;
	private int draw;
	private List<Map> ownedMaps;
	
	@OneToMany(targetEntity=Map.class)
	@JoinColumn(name="user_name") // <-- avoids creating an extra User_Map table
	public List<Map> getOwnedMaps() {
		return ownedMaps;
	}
	
	public void setOwnedBooks(List<Map> ownedMaps) {
		this.ownedMaps = ownedMaps;

	}
	
	private String roles; // split by , to separate roles
	private byte enabled;
	
	@Id
	@GeneratedValue
	public long getId() {
	return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}
	
	@Column(unique=true)
	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String user_password) {
		this.password = password;
	}

	public int getWin() {
		return win;
	}

	public void setWin(int win) {
		this.win = win;
	}

	public int getLose() {
		return lose;
	}

	public void setLose(int lose) {
		this.lose = lose;
	}

	public int getDraw() {
		return draw;
	}

	public void setDraw(int draw) {
		this.draw = draw;
	}

	public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	public byte getEnabled() {
		return enabled;
	}

	public void setEnabled(byte enabled) {
		this.enabled = enabled;
	}	

}

